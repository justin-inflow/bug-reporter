const express = require("express");
const axios = require("axios");
const crypto = require("crypto");

const app = express();

// ─── Raw body needed for Slack signature verification ───────────────────────
app.use(express.json({
  verify: (req, _res, buf) => { req.rawBody = buf; }
}));

const {
  SLACK_BOT_TOKEN,
  SLACK_SIGNING_SECRET,
  GEMINI_API_KEY,
  YOUTRACK_URL,       // e.g. https://yourteam.youtrack.cloud
  YOUTRACK_TOKEN,
  PORT = 3000,
} = process.env;

// ─── Verify requests actually come from Slack ────────────────────────────────
function verifySlack(req, res) {
  const ts = req.headers["x-slack-request-timestamp"];
  const sig = req.headers["x-slack-signature"];
  if (!ts || !sig) { res.sendStatus(403); return false; }
  const base = `v0:${ts}:${req.rawBody}`;
  const expected = "v0=" + crypto.createHmac("sha256", SLACK_SIGNING_SECRET)
    .update(base).digest("hex");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    res.sendStatus(403); return false;
  }
  return true;
}

// ─── Fetch all messages in a Slack thread ────────────────────────────────────
async function fetchThread(channel, threadTs) {
  const { data } = await axios.get(
    "https://slack.com/api/conversations.replies",
    {
      params: { channel, ts: threadTs, limit: 200 },
      headers: { Authorization: `Bearer ${SLACK_BOT_TOKEN}` },
    }
  );
  if (!data.ok) throw new Error(`Slack error: ${data.error}`);
  return data.messages.map((m) => m.text).join("\n---\n");
}

// ─── Ask Gemini to turn thread text into a structured bug report ─────────────
async function generateBugReport(threadText, threadUrl) {
  const prompt = `You are a bug report assistant. Given the following Slack thread, extract and generate a structured bug report.

Return ONLY valid JSON with exactly these keys:
- title: short, clear bug title (max 10 words, no punctuation at end)
- summary: 1-2 sentence description of what went wrong
- steps: numbered steps to reproduce (use \\n between steps)
- expected: what should have happened
- actual: what actually happened
- customers: affected customer names or "Unknown" if not mentioned

Slack thread:
${threadText}`;

  const res = await axios.post(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    },
    { headers: { "Content-Type": "application/json" } }
  );

  const raw = res.data.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim();
  return JSON.parse(raw);
}

// ─── Create a bug issue in YouTrack ─────────────────────────────────────────
async function createYouTrackIssue(report, threadUrl) {
  const description = `## Summary
${report.summary}

## Steps to reproduce
${report.steps}

## Expected Behaviour
${report.expected}

## Actual Behaviour
${report.actual}

## Slack Thread
${threadUrl}

## Affected Customers
${report.customers}`;

  const { data } = await axios.post(
    `${YOUTRACK_URL}/api/issues?fields=id,idReadable,summary`,
    {
      project: { id: "BLT" },
      summary: report.title,
      description,
      customFields: [
        { $type: "SingleEnumIssueCustomField", name: "Type",     value: { name: "Bug" } },
        { $type: "SingleEnumIssueCustomField", name: "Followup", value: { name: "Customer" } },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${YOUTRACK_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  return data;
}

// ─── Post a reply back into the Slack thread ─────────────────────────────────
async function postSlackReply(channel, threadTs, text) {
  await axios.post(
    "https://slack.com/api/chat.postMessage",
    { channel, thread_ts: threadTs, text },
    { headers: { Authorization: `Bearer ${SLACK_BOT_TOKEN}` } }
  );
}

// ─── Core handler — shared by emoji and slash command ────────────────────────
async function handleBugReport({ channel, threadTs, threadUrl, responseUrl }) {
  const threadText = await fetchThread(channel, threadTs);
  const report     = await generateBugReport(threadText, threadUrl);
  const issue      = await createYouTrackIssue(report, threadUrl);
  const issueUrl   = `${YOUTRACK_URL}/issue/${issue.idReadable}`;
  const msg        = `✅ Bug ticket created: *<${issueUrl}|${issue.idReadable}>* — ${report.title}`;

  if (responseUrl) {
    // Slash command — respond ephemerally so only the caller sees it
    await axios.post(responseUrl, { response_type: "ephemeral", text: msg });
  }
  // Always reply in the thread so the whole team can see it
  await postSlackReply(channel, threadTs, msg);
}

// ─── ROUTE: Emoji reaction ───────────────────────────────────────────────────
app.post("/slack/events", async (req, res) => {
  if (!verifySlack(req, res)) return;

  const { type, event, challenge } = req.body;

  // Slack sends this once when you first set the URL — just reply with the challenge
  if (type === "url_verification") return res.json({ challenge });

  res.sendStatus(200); // Acknowledge immediately (Slack requires < 3s)

  if (
    type === "event_callback" &&
    event?.type === "reaction_added" &&
    event.reaction === "reportinprogress"
  ) {
    try {
      const channel  = event.item.channel;
      const threadTs = event.item.ts;
      const threadUrl = `https://slack.com/archives/${channel}/p${threadTs.replace(".", "")}`;
      console.log("Emoji trigger fired:", { channel, threadTs, reaction: event.reaction });
      await handleBugReport({ channel, threadTs, threadUrl });
    } catch (err) {
      console.error("Emoji trigger error:", err.message);
      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", JSON.stringify(err.response.data));
      }
    }
  }
});

// ─── ROUTE: Slash command (/bugreport) ───────────────────────────────────────
app.post("/slack/command", async (req, res) => {
  if (!verifySlack(req, res)) return;

  // Acknowledge immediately with a temporary message
  res.json({ response_type: "ephemeral", text: "⏳ Creating bug ticket…" });

  try {
    const { channel_id, text, thread_ts, response_url } = req.body;

    let channel  = channel_id;
    let threadTs = thread_ts; // works when run inside a thread

    // If a thread URL was pasted, parse channel + ts from it
    // e.g. https://yourworkspace.slack.com/archives/C12345/p1234567890123456
    const urlMatch = text?.match(/archives\/([A-Z0-9]+)\/p(\d+)/);
    if (urlMatch) {
      channel  = urlMatch[1];
      const raw = urlMatch[2];           // 16-digit string
      threadTs = raw.slice(0, 10) + "." + raw.slice(10); // → unix.microseconds
    }

    if (!threadTs) {
      await axios.post(response_url, {
        response_type: "ephemeral",
        text: "⚠️ Run this command inside a thread, or paste a thread URL after the command.",
      });
      return;
    }

    const threadUrl = `https://slack.com/archives/${channel}/p${threadTs.replace(".", "")}`;
    await handleBugReport({ channel, threadTs, threadUrl, responseUrl: response_url });
  } catch (err) {
    console.error("Slash command error:", err.message);
  }
});

// ─── ROUTE: Interactivity placeholder (required by manifest) ─────────────────
app.post("/slack/interactive", (req, res) => res.sendStatus(200));

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`BugReporter listening on port ${PORT}`));
