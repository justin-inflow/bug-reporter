{\rtf1\ansi\ansicpg1252\cocoartf2869
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 .AppleSystemUIFontMonospaced-Regular;}
{\colortbl;\red255\green255\blue255;\red191\green94\blue241;\red36\green36\blue35;\red229\green231\blue236;
\red95\green167\blue255;\red201\green206\blue214;\red140\green233\blue81;\red110\green117\blue134;\red243\green155\blue77;
\red82\green235\blue232;\red248\green157\blue78;\red239\green99\blue114;\red135\green225\blue77;}
{\*\expandedcolortbl;;\cssrgb\c80000\c48235\c95686;\cssrgb\c18824\c18824\c18039;\cssrgb\c91765\c92549\c94118;
\cssrgb\c43922\c72157\c100000;\cssrgb\c82745\c84314\c87059;\cssrgb\c60784\c91373\c38824;\cssrgb\c50588\c53333\c59608;\cssrgb\c96863\c67059\c37255;
\cssrgb\c36863\c92941\c92941;\cssrgb\c98431\c67843\c37647;\cssrgb\c95686\c48235\c52157;\cssrgb\c58824\c89020\c37255;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs28 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 const\cf4 \strokec4  express = \cf5 \strokec5 require\cf6 \strokec6 (\cf7 \strokec7 "express"\cf6 \strokec6 );\cf4 \strokec4 \
\cf2 \strokec2 const\cf4 \strokec4  axios = \cf5 \strokec5 require\cf6 \strokec6 (\cf7 \strokec7 "axios"\cf6 \strokec6 );\cf4 \strokec4 \
\cf2 \strokec2 const\cf4 \strokec4  crypto = \cf5 \strokec5 require\cf6 \strokec6 (\cf7 \strokec7 "crypto"\cf6 \strokec6 );\cf4 \strokec4 \
\
\cf2 \strokec2 const\cf4 \strokec4  app = \cf5 \strokec5 express\cf6 \strokec6 ();\cf4 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf8 \strokec8 // \uc0\u9472 \u9472 \u9472  Raw body needed for Slack signature verification \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \cf4 \strokec4 \
app\cf6 \strokec6 .\cf5 \strokec5 use\cf6 \strokec6 (\cf4 \strokec4 express\cf6 \strokec6 .\cf5 \strokec5 json\cf6 \strokec6 (\{\cf4 \strokec4 \
  \cf5 \strokec5 verify\cf4 \strokec4 : \cf6 \strokec6 (\cf9 \strokec9 req\cf6 \strokec6 ,\cf9 \strokec9  _res\cf6 \strokec6 ,\cf9 \strokec9  buf\cf6 \strokec6 )\cf4 \strokec4  => \cf6 \strokec6 \{\cf4 \strokec4  req\cf6 \strokec6 .\cf4 \strokec4 rawBody = buf\cf6 \strokec6 ;\cf4 \strokec4  \cf6 \strokec6 \}\cf4 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf6 \strokec6 \}));\cf4 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \strokec2 const\cf4 \strokec4  \cf6 \strokec6 \{\cf4 \strokec4 \
  \cf10 \strokec10 SLACK_BOT_TOKEN\cf6 \strokec6 ,\cf4 \strokec4 \
  \cf10 \strokec10 SLACK_SIGNING_SECRET\cf6 \strokec6 ,\cf4 \strokec4 \
  \cf10 \strokec10 ANTHROPIC_API_KEY\cf6 \strokec6 ,\cf4 \strokec4 \
  \cf10 \strokec10 YOUTRACK_URL\cf6 \strokec6 ,\cf4 \strokec4        \cf8 \strokec8 // e.g. https://yourteam.youtrack.cloud\cf4 \strokec4 \
  \cf10 \strokec10 YOUTRACK_TOKEN\cf6 \strokec6 ,\cf4 \strokec4 \
  \cf10 \strokec10 PORT\cf4 \strokec4  = \cf10 \strokec10 3000\cf6 \strokec6 ,\cf4 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf6 \strokec6 \}\cf4 \strokec4  = process\cf6 \strokec6 .\cf4 \strokec4 env\cf6 \strokec6 ;\cf4 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf8 \strokec8 // \uc0\u9472 \u9472 \u9472  Verify requests actually come from Slack \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \cf4 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf2 \strokec2 function\cf4 \strokec4  \cf5 \strokec5 verifySlack\cf6 \strokec6 (\cf9 \strokec9 req\cf6 \strokec6 ,\cf9 \strokec9  res\cf6 \strokec6 )\cf4 \strokec4  \cf6 \strokec6 \{\cf4 \strokec4 \
  \cf2 \strokec2 const\cf4 \strokec4  ts = req\cf6 \strokec6 .\cf4 \strokec4 headers\cf6 \strokec6 [\cf7 \strokec7 "x-slack-request-timestamp"\cf6 \strokec6 ];\cf4 \strokec4 \
  \cf2 \strokec2 const\cf4 \strokec4  sig = req\cf6 \strokec6 .\cf4 \strokec4 headers\cf6 \strokec6 [\cf7 \strokec7 "x-slack-signature"\cf6 \strokec6 ];\cf4 \strokec4 \
  \cf2 \strokec2 if\cf4 \strokec4  \cf6 \strokec6 (\cf4 \strokec4 !ts || !sig\cf6 \strokec6 )\cf4 \strokec4  \cf6 \strokec6 \{\cf4 \strokec4  res\cf6 \strokec6 .\cf5 \strokec5 sendStatus\cf6 \strokec6 (\cf10 \strokec10 403\cf6 \strokec6 );\cf4 \strokec4  \cf2 \strokec2 return\cf4 \strokec4  \cf10 \strokec10 false\cf6 \strokec6 ;\cf4 \strokec4  \cf6 \strokec6 \}\cf4 \strokec4 \
  \cf2 \strokec2 const\cf4 \strokec4  base = \cf7 \strokec7 `v0:\cf6 \strokec6 $\{\cf7 \strokec7 ts\cf6 \strokec6 \}\cf7 \strokec7 :\cf6 \strokec6 $\{\cf7 \strokec7 req\cf6 \strokec6 .\cf7 \strokec7 rawBody\cf6 \strokec6 \}\cf7 \strokec7 `\cf6 \strokec6 ;\cf4 \strokec4 \
  \cf2 \strokec2 const\cf4 \strokec4  expected = \cf7 \strokec7 "v0="\cf4 \strokec4  + crypto\cf6 \strokec6 .\cf5 \strokec5 createHmac\cf6 \strokec6 (\cf7 \strokec7 "sha256"\cf6 \strokec6 ,\cf4 \strokec4  \cf10 \strokec10 SLACK_SIGNING_SECRET\cf6 \strokec6 )\cf4 \strokec4 \
    \cf6 \strokec6 .\cf5 \strokec5 update\cf6 \strokec6 (\cf4 \strokec4 base\cf6 \strokec6 ).\cf5 \strokec5 digest\cf6 \strokec6 (\cf7 \strokec7 "hex"\cf6 \strokec6 );\cf4 \strokec4 \
  \cf2 \strokec2 if\cf4 \strokec4  \cf6 \strokec6 (\cf4 \strokec4 !crypto\cf6 \strokec6 .\cf5 \strokec5 timingSafeEqual\cf6 \strokec6 (\cf11 \strokec11 Buffer\cf6 \strokec6 .\cf2 \strokec2 from\cf6 \strokec6 (\cf4 \strokec4 sig\cf6 \strokec6 ),\cf4 \strokec4  \cf11 \strokec11 Buffer\cf6 \strokec6 .\cf2 \strokec2 from\cf6 \strokec6 (\cf4 \strokec4 expected\cf6 \strokec6 )))\cf4 \strokec4  \cf6 \strokec6 \{\cf4 \strokec4 \
    res\cf6 \strokec6 .\cf5 \strokec5 sendStatus\cf6 \strokec6 (\cf10 \strokec10 403\cf6 \strokec6 );\cf4 \strokec4  \cf2 \strokec2 return\cf4 \strokec4  \cf10 \strokec10 false\cf6 \strokec6 ;\cf4 \strokec4 \
  \cf6 \strokec6 \}\cf4 \strokec4 \
  \cf2 \strokec2 return\cf4 \strokec4  \cf10 \strokec10 true\cf6 \strokec6 ;\cf4 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf6 \strokec6 \}\cf4 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf8 \strokec8 // \uc0\u9472 \u9472 \u9472  Fetch all messages in a Slack thread \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \cf4 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf2 \strokec2 async\cf4 \strokec4  \cf2 \strokec2 function\cf4 \strokec4  \cf5 \strokec5 fetchThread\cf6 \strokec6 (\cf9 \strokec9 channel\cf6 \strokec6 ,\cf9 \strokec9  threadTs\cf6 \strokec6 )\cf4 \strokec4  \cf6 \strokec6 \{\cf4 \strokec4 \
  \cf2 \strokec2 const\cf4 \strokec4  \cf6 \strokec6 \{\cf4 \strokec4  data \cf6 \strokec6 \}\cf4 \strokec4  = \cf2 \strokec2 await\cf4 \strokec4  axios\cf6 \strokec6 .\cf5 \strokec5 get\cf6 \strokec6 (\cf4 \strokec4 \
    \cf7 \strokec7 "https://slack.com/api/conversations.replies"\cf6 \strokec6 ,\cf4 \strokec4 \
    \cf6 \strokec6 \{\cf4 \strokec4 \
      \cf12 \strokec12 params\cf4 \strokec4 : \cf6 \strokec6 \{\cf4 \strokec4  channel\cf6 \strokec6 ,\cf4 \strokec4  \cf12 \strokec12 ts\cf4 \strokec4 : threadTs\cf6 \strokec6 ,\cf4 \strokec4  \cf12 \strokec12 limit\cf4 \strokec4 : \cf10 \strokec10 200\cf4 \strokec4  \cf6 \strokec6 \},\cf4 \strokec4 \
      \cf12 \strokec12 headers\cf4 \strokec4 : \cf6 \strokec6 \{\cf4 \strokec4  \cf12 \strokec12 Authorization\cf4 \strokec4 : \cf7 \strokec7 `Bearer \cf6 \strokec6 $\{\cf10 \strokec10 SLACK_BOT_TOKEN\cf6 \strokec6 \}\cf7 \strokec7 `\cf4 \strokec4  \cf6 \strokec6 \},\cf4 \strokec4 \
    \cf6 \strokec6 \}\cf4 \strokec4 \
  \cf6 \strokec6 );\cf4 \strokec4 \
  \cf2 \strokec2 if\cf4 \strokec4  \cf6 \strokec6 (\cf4 \strokec4 !data\cf6 \strokec6 .\cf4 \strokec4 ok\cf6 \strokec6 )\cf4 \strokec4  \cf2 \strokec2 throw\cf4 \strokec4  \cf2 \strokec2 new\cf4 \strokec4  \cf11 \strokec11 Error\cf6 \strokec6 (\cf7 \strokec7 `Slack error: \cf6 \strokec6 $\{\cf7 \strokec7 data\cf6 \strokec6 .\cf7 \strokec7 error\cf6 \strokec6 \}\cf7 \strokec7 `\cf6 \strokec6 );\cf4 \strokec4 \
  \cf2 \strokec2 return\cf4 \strokec4  data\cf6 \strokec6 .\cf4 \strokec4 messages\cf6 \strokec6 .\cf5 \strokec5 map\cf6 \strokec6 ((\cf9 \strokec9 m\cf6 \strokec6 )\cf4 \strokec4  => m\cf6 \strokec6 .\cf4 \strokec4 text\cf6 \strokec6 ).\cf5 \strokec5 join\cf6 \strokec6 (\cf7 \strokec7 "\\n---\\n"\cf6 \strokec6 );\cf4 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf6 \strokec6 \}\cf4 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf8 \strokec8 // \uc0\u9472 \u9472 \u9472  Ask Claude to turn thread text into a structured bug report \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \cf4 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf2 \strokec2 async\cf4 \strokec4  \cf2 \strokec2 function\cf4 \strokec4  \cf5 \strokec5 generateBugReport\cf6 \strokec6 (\cf9 \strokec9 threadText\cf6 \strokec6 ,\cf9 \strokec9  threadUrl\cf6 \strokec6 )\cf4 \strokec4  \cf6 \strokec6 \{\cf4 \strokec4 \
  \cf2 \strokec2 const\cf4 \strokec4  prompt = \cf7 \strokec7 `You are a bug report assistant. Given the following Slack thread, extract and generate a structured bug report.\
\pard\pardeftab720\partightenfactor0
\cf4 \strokec4 \
Return ONLY valid JSON with exactly these keys:\
- title: short, clear bug title (max 10 words, no punctuation at end)\
- summary: 1-2 sentence description of what went wrong\
- steps: numbered steps to reproduce (use \\\\n between steps)\
- expected: what should have happened\
- actual: what actually happened\
- customers: affected customer names or "Unknown" if not mentioned\
\
Slack thread:\
\pard\pardeftab720\partightenfactor0
\cf6 \strokec6 $\{\cf7 \strokec7 threadText\cf6 \strokec6 \}\cf7 \strokec7 `\cf6 \strokec6 ;\cf4 \strokec4 \
\
  \cf2 \strokec2 const\cf4 \strokec4  res = \cf2 \strokec2 await\cf4 \strokec4  axios\cf6 \strokec6 .\cf5 \strokec5 post\cf6 \strokec6 (\cf4 \strokec4 \
    \cf7 \strokec7 "https://api.anthropic.com/v1/messages"\cf6 \strokec6 ,\cf4 \strokec4 \
    \cf6 \strokec6 \{\cf4 \strokec4 \
      \cf12 \strokec12 model\cf4 \strokec4 : \cf7 \strokec7 "claude-sonnet-4-20250514"\cf6 \strokec6 ,\cf4 \strokec4 \
      \cf12 \strokec12 max_tokens\cf4 \strokec4 : \cf10 \strokec10 1000\cf6 \strokec6 ,\cf4 \strokec4 \
      \cf12 \strokec12 messages\cf4 \strokec4 : \cf6 \strokec6 [\{\cf4 \strokec4  \cf12 \strokec12 role\cf4 \strokec4 : \cf7 \strokec7 "user"\cf6 \strokec6 ,\cf4 \strokec4  \cf12 \strokec12 content\cf4 \strokec4 : prompt \cf6 \strokec6 \}],\cf4 \strokec4 \
    \cf6 \strokec6 \},\cf4 \strokec4 \
    \cf6 \strokec6 \{\cf4 \strokec4 \
      \cf12 \strokec12 headers\cf4 \strokec4 : \cf6 \strokec6 \{\cf4 \strokec4 \
        \cf12 \strokec12 "x-api-key"\cf4 \strokec4 : \cf10 \strokec10 ANTHROPIC_API_KEY\cf6 \strokec6 ,\cf4 \strokec4 \
        \cf12 \strokec12 "anthropic-version"\cf4 \strokec4 : \cf7 \strokec7 "2023-06-01"\cf6 \strokec6 ,\cf4 \strokec4 \
        \cf12 \strokec12 "content-type"\cf4 \strokec4 : \cf7 \strokec7 "application/json"\cf6 \strokec6 ,\cf4 \strokec4 \
      \cf6 \strokec6 \},\cf4 \strokec4 \
    \cf6 \strokec6 \}\cf4 \strokec4 \
  \cf6 \strokec6 );\cf4 \strokec4 \
\
  \cf2 \strokec2 const\cf4 \strokec4  raw = res\cf6 \strokec6 .\cf4 \strokec4 data\cf6 \strokec6 .\cf4 \strokec4 content\cf6 \strokec6 [\cf10 \strokec10 0\cf6 \strokec6 ].\cf4 \strokec4 text\cf6 \strokec6 .\cf5 \strokec5 replace\cf6 \strokec6 (\cf13 \strokec13 /```json|```/g\cf6 \strokec6 ,\cf4 \strokec4  \cf7 \strokec7 ""\cf6 \strokec6 ).\cf5 \strokec5 trim\cf6 \strokec6 ();\cf4 \strokec4 \
  \cf2 \strokec2 return\cf4 \strokec4  \cf11 \strokec11 JSON\cf6 \strokec6 .\cf5 \strokec5 parse\cf6 \strokec6 (\cf4 \strokec4 raw\cf6 \strokec6 );\cf4 \strokec4 \
\cf6 \strokec6 \}\cf4 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf8 \strokec8 // \uc0\u9472 \u9472 \u9472  Create a bug issue in YouTrack \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \cf4 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf2 \strokec2 async\cf4 \strokec4  \cf2 \strokec2 function\cf4 \strokec4  \cf5 \strokec5 createYouTrackIssue\cf6 \strokec6 (\cf9 \strokec9 report\cf6 \strokec6 ,\cf9 \strokec9  threadUrl\cf6 \strokec6 )\cf4 \strokec4  \cf6 \strokec6 \{\cf4 \strokec4 \
  \cf2 \strokec2 const\cf4 \strokec4  description = \cf7 \strokec7 `## Summary\
\pard\pardeftab720\partightenfactor0
\cf6 \strokec6 $\{\cf7 \strokec7 report\cf6 \strokec6 .\cf7 \strokec7 summary\cf6 \strokec6 \}\cf7 \strokec7 \
\pard\pardeftab720\partightenfactor0
\cf4 \strokec4 \
## Steps to reproduce\
\pard\pardeftab720\partightenfactor0
\cf6 \strokec6 $\{\cf7 \strokec7 report\cf6 \strokec6 .\cf7 \strokec7 steps\cf6 \strokec6 \}\cf7 \strokec7 \
\pard\pardeftab720\partightenfactor0
\cf4 \strokec4 \
## Expected Behaviour\
\pard\pardeftab720\partightenfactor0
\cf6 \strokec6 $\{\cf7 \strokec7 report\cf6 \strokec6 .\cf7 \strokec7 expected\cf6 \strokec6 \}\cf7 \strokec7 \
\pard\pardeftab720\partightenfactor0
\cf4 \strokec4 \
## Actual Behaviour\
\pard\pardeftab720\partightenfactor0
\cf6 \strokec6 $\{\cf7 \strokec7 report\cf6 \strokec6 .\cf7 \strokec7 actual\cf6 \strokec6 \}\cf7 \strokec7 \
\pard\pardeftab720\partightenfactor0
\cf4 \strokec4 \
## Slack Thread\
\pard\pardeftab720\partightenfactor0
\cf6 \strokec6 $\{\cf7 \strokec7 threadUrl\cf6 \strokec6 \}\cf7 \strokec7 \
\pard\pardeftab720\partightenfactor0
\cf4 \strokec4 \
## Affected Customers\
\pard\pardeftab720\partightenfactor0
\cf6 \strokec6 $\{\cf7 \strokec7 report\cf6 \strokec6 .\cf7 \strokec7 customers\cf6 \strokec6 \}\cf7 \strokec7 `\cf6 \strokec6 ;\cf4 \strokec4 \
\
  \cf2 \strokec2 const\cf4 \strokec4  \cf6 \strokec6 \{\cf4 \strokec4  data \cf6 \strokec6 \}\cf4 \strokec4  = \cf2 \strokec2 await\cf4 \strokec4  axios\cf6 \strokec6 .\cf5 \strokec5 post\cf6 \strokec6 (\cf4 \strokec4 \
    \cf7 \strokec7 `\cf6 \strokec6 $\{\cf10 \strokec10 YOUTRACK_URL\cf6 \strokec6 \}\cf7 \strokec7 /api/issues?fields=id,idReadable,summary`\cf6 \strokec6 ,\cf4 \strokec4 \
    \cf6 \strokec6 \{\cf4 \strokec4 \
      \cf12 \strokec12 project\cf4 \strokec4 : \cf6 \strokec6 \{\cf4 \strokec4  \cf12 \strokec12 id\cf4 \strokec4 : \cf7 \strokec7 "BLT"\cf4 \strokec4  \cf6 \strokec6 \},\cf4 \strokec4 \
      \cf12 \strokec12 summary\cf4 \strokec4 : report\cf6 \strokec6 .\cf4 \strokec4 title\cf6 \strokec6 ,\cf4 \strokec4 \
      description\cf6 \strokec6 ,\cf4 \strokec4 \
      \cf12 \strokec12 customFields\cf4 \strokec4 : \cf6 \strokec6 [\cf4 \strokec4 \
        \cf6 \strokec6 \{\cf4 \strokec4  \cf12 \strokec12 $type\cf4 \strokec4 : \cf7 \strokec7 "SingleEnumIssueCustomField"\cf6 \strokec6 ,\cf4 \strokec4  \cf12 \strokec12 name\cf4 \strokec4 : \cf7 \strokec7 "Type"\cf6 \strokec6 ,\cf4 \strokec4      \cf12 \strokec12 value\cf4 \strokec4 : \cf6 \strokec6 \{\cf4 \strokec4  \cf12 \strokec12 name\cf4 \strokec4 : \cf7 \strokec7 "Bug"\cf4 \strokec4  \cf6 \strokec6 \}\cf4 \strokec4  \cf6 \strokec6 \},\cf4 \strokec4 \
        \cf6 \strokec6 \{\cf4 \strokec4  \cf12 \strokec12 $type\cf4 \strokec4 : \cf7 \strokec7 "SingleEnumIssueCustomField"\cf6 \strokec6 ,\cf4 \strokec4  \cf12 \strokec12 name\cf4 \strokec4 : \cf7 \strokec7 "Followup"\cf6 \strokec6 ,\cf4 \strokec4  \cf12 \strokec12 value\cf4 \strokec4 : \cf6 \strokec6 \{\cf4 \strokec4  \cf12 \strokec12 name\cf4 \strokec4 : \cf7 \strokec7 "Customer"\cf4 \strokec4  \cf6 \strokec6 \}\cf4 \strokec4  \cf6 \strokec6 \},\cf4 \strokec4 \
      \cf6 \strokec6 ],\cf4 \strokec4 \
    \cf6 \strokec6 \},\cf4 \strokec4 \
    \cf6 \strokec6 \{\cf4 \strokec4 \
      \cf12 \strokec12 headers\cf4 \strokec4 : \cf6 \strokec6 \{\cf4 \strokec4 \
        \cf12 \strokec12 Authorization\cf4 \strokec4 : \cf7 \strokec7 `Bearer \cf6 \strokec6 $\{\cf10 \strokec10 YOUTRACK_TOKEN\cf6 \strokec6 \}\cf7 \strokec7 `\cf6 \strokec6 ,\cf4 \strokec4 \
        \cf12 \strokec12 "Content-Type"\cf4 \strokec4 : \cf7 \strokec7 "application/json"\cf6 \strokec6 ,\cf4 \strokec4 \
        \cf12 \strokec12 Accept\cf4 \strokec4 : \cf7 \strokec7 "application/json"\cf6 \strokec6 ,\cf4 \strokec4 \
      \cf6 \strokec6 \},\cf4 \strokec4 \
    \cf6 \strokec6 \}\cf4 \strokec4 \
  \cf6 \strokec6 );\cf4 \strokec4 \
  \cf2 \strokec2 return\cf4 \strokec4  data\cf6 \strokec6 ;\cf4 \strokec4 \
\cf6 \strokec6 \}\cf4 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf8 \strokec8 // \uc0\u9472 \u9472 \u9472  Post a reply back into the Slack thread \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \cf4 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf2 \strokec2 async\cf4 \strokec4  \cf2 \strokec2 function\cf4 \strokec4  \cf5 \strokec5 postSlackReply\cf6 \strokec6 (\cf9 \strokec9 channel\cf6 \strokec6 ,\cf9 \strokec9  threadTs\cf6 \strokec6 ,\cf9 \strokec9  text\cf6 \strokec6 )\cf4 \strokec4  \cf6 \strokec6 \{\cf4 \strokec4 \
  \cf2 \strokec2 await\cf4 \strokec4  axios\cf6 \strokec6 .\cf5 \strokec5 post\cf6 \strokec6 (\cf4 \strokec4 \
    \cf7 \strokec7 "https://slack.com/api/chat.postMessage"\cf6 \strokec6 ,\cf4 \strokec4 \
    \cf6 \strokec6 \{\cf4 \strokec4  channel\cf6 \strokec6 ,\cf4 \strokec4  \cf12 \strokec12 thread_ts\cf4 \strokec4 : threadTs\cf6 \strokec6 ,\cf4 \strokec4  text \cf6 \strokec6 \},\cf4 \strokec4 \
    \cf6 \strokec6 \{\cf4 \strokec4  \cf12 \strokec12 headers\cf4 \strokec4 : \cf6 \strokec6 \{\cf4 \strokec4  \cf12 \strokec12 Authorization\cf4 \strokec4 : \cf7 \strokec7 `Bearer \cf6 \strokec6 $\{\cf10 \strokec10 SLACK_BOT_TOKEN\cf6 \strokec6 \}\cf7 \strokec7 `\cf4 \strokec4  \cf6 \strokec6 \}\cf4 \strokec4  \cf6 \strokec6 \}\cf4 \strokec4 \
  \cf6 \strokec6 );\cf4 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf6 \strokec6 \}\cf4 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf8 \strokec8 // \uc0\u9472 \u9472 \u9472  Core handler \'97 shared by emoji and slash command \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \cf4 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf2 \strokec2 async\cf4 \strokec4  \cf2 \strokec2 function\cf4 \strokec4  \cf5 \strokec5 handleBugReport\cf6 \strokec6 (\{\cf9 \strokec9  channel\cf6 \strokec6 ,\cf9 \strokec9  threadTs\cf6 \strokec6 ,\cf9 \strokec9  threadUrl\cf6 \strokec6 ,\cf9 \strokec9  responseUrl \cf6 \strokec6 \})\cf4 \strokec4  \cf6 \strokec6 \{\cf4 \strokec4 \
  \cf2 \strokec2 const\cf4 \strokec4  threadText = \cf2 \strokec2 await\cf4 \strokec4  \cf5 \strokec5 fetchThread\cf6 \strokec6 (\cf4 \strokec4 channel\cf6 \strokec6 ,\cf4 \strokec4  threadTs\cf6 \strokec6 );\cf4 \strokec4 \
  \cf2 \strokec2 const\cf4 \strokec4  report     = \cf2 \strokec2 await\cf4 \strokec4  \cf5 \strokec5 generateBugReport\cf6 \strokec6 (\cf4 \strokec4 threadText\cf6 \strokec6 ,\cf4 \strokec4  threadUrl\cf6 \strokec6 );\cf4 \strokec4 \
  \cf2 \strokec2 const\cf4 \strokec4  issue      = \cf2 \strokec2 await\cf4 \strokec4  \cf5 \strokec5 createYouTrackIssue\cf6 \strokec6 (\cf4 \strokec4 report\cf6 \strokec6 ,\cf4 \strokec4  threadUrl\cf6 \strokec6 );\cf4 \strokec4 \
  \cf2 \strokec2 const\cf4 \strokec4  issueUrl   = \cf7 \strokec7 `\cf6 \strokec6 $\{\cf10 \strokec10 YOUTRACK_URL\cf6 \strokec6 \}\cf7 \strokec7 /issue/\cf6 \strokec6 $\{\cf7 \strokec7 issue\cf6 \strokec6 .\cf7 \strokec7 idReadable\cf6 \strokec6 \}\cf7 \strokec7 `\cf6 \strokec6 ;\cf4 \strokec4 \
  \cf2 \strokec2 const\cf4 \strokec4  msg        = \cf7 \strokec7 `\uc0\u9989  Bug ticket created: *<\cf6 \strokec6 $\{\cf7 \strokec7 issueUrl\cf6 \strokec6 \}\cf7 \strokec7 |\cf6 \strokec6 $\{\cf7 \strokec7 issue\cf6 \strokec6 .\cf7 \strokec7 idReadable\cf6 \strokec6 \}\cf7 \strokec7 >* \'97 \cf6 \strokec6 $\{\cf7 \strokec7 report\cf6 \strokec6 .\cf7 \strokec7 title\cf6 \strokec6 \}\cf7 \strokec7 `\cf6 \strokec6 ;\cf4 \strokec4 \
\
  \cf2 \strokec2 if\cf4 \strokec4  \cf6 \strokec6 (\cf4 \strokec4 responseUrl\cf6 \strokec6 )\cf4 \strokec4  \cf6 \strokec6 \{\cf4 \strokec4 \
    \cf8 \strokec8 // Slash command \'97 respond ephemerally so only the caller sees it\cf4 \strokec4 \
    \cf2 \strokec2 await\cf4 \strokec4  axios\cf6 \strokec6 .\cf5 \strokec5 post\cf6 \strokec6 (\cf4 \strokec4 responseUrl\cf6 \strokec6 ,\cf4 \strokec4  \cf6 \strokec6 \{\cf4 \strokec4  \cf12 \strokec12 response_type\cf4 \strokec4 : \cf7 \strokec7 "ephemeral"\cf6 \strokec6 ,\cf4 \strokec4  \cf12 \strokec12 text\cf4 \strokec4 : msg \cf6 \strokec6 \});\cf4 \strokec4 \
  \cf6 \strokec6 \}\cf4 \strokec4 \
  \cf8 \strokec8 // Always reply in the thread so the whole team can see it\cf4 \strokec4 \
  \cf2 \strokec2 await\cf4 \strokec4  \cf5 \strokec5 postSlackReply\cf6 \strokec6 (\cf4 \strokec4 channel\cf6 \strokec6 ,\cf4 \strokec4  threadTs\cf6 \strokec6 ,\cf4 \strokec4  msg\cf6 \strokec6 );\cf4 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf6 \strokec6 \}\cf4 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf8 \strokec8 // \uc0\u9472 \u9472 \u9472  ROUTE: Emoji reaction \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \cf4 \strokec4 \
app\cf6 \strokec6 .\cf5 \strokec5 post\cf6 \strokec6 (\cf7 \strokec7 "/slack/events"\cf6 \strokec6 ,\cf4 \strokec4  \cf2 \strokec2 async\cf4 \strokec4  \cf6 \strokec6 (\cf9 \strokec9 req\cf6 \strokec6 ,\cf9 \strokec9  res\cf6 \strokec6 )\cf4 \strokec4  => \cf6 \strokec6 \{\cf4 \strokec4 \
  \cf2 \strokec2 if\cf4 \strokec4  \cf6 \strokec6 (\cf4 \strokec4 !\cf5 \strokec5 verifySlack\cf6 \strokec6 (\cf4 \strokec4 req\cf6 \strokec6 ,\cf4 \strokec4  res\cf6 \strokec6 ))\cf4 \strokec4  \cf2 \strokec2 return\cf6 \strokec6 ;\cf4 \strokec4 \
\
  \cf2 \strokec2 const\cf4 \strokec4  \cf6 \strokec6 \{\cf4 \strokec4  type\cf6 \strokec6 ,\cf4 \strokec4  event\cf6 \strokec6 ,\cf4 \strokec4  challenge \cf6 \strokec6 \}\cf4 \strokec4  = req\cf6 \strokec6 .\cf4 \strokec4 body\cf6 \strokec6 ;\cf4 \strokec4 \
\
  \cf8 \strokec8 // Slack sends this once when you first set the URL \'97 just reply with the challenge\cf4 \strokec4 \
  \cf2 \strokec2 if\cf4 \strokec4  \cf6 \strokec6 (\cf4 \strokec4 type === \cf7 \strokec7 "url_verification"\cf6 \strokec6 )\cf4 \strokec4  \cf2 \strokec2 return\cf4 \strokec4  res\cf6 \strokec6 .\cf5 \strokec5 json\cf6 \strokec6 (\{\cf4 \strokec4  challenge \cf6 \strokec6 \});\cf4 \strokec4 \
\
  res\cf6 \strokec6 .\cf5 \strokec5 sendStatus\cf6 \strokec6 (\cf10 \strokec10 200\cf6 \strokec6 );\cf4 \strokec4  \cf8 \strokec8 // Acknowledge immediately (Slack requires < 3s)\cf4 \strokec4 \
\
  \cf2 \strokec2 if\cf4 \strokec4  \cf6 \strokec6 (\cf4 \strokec4 \
    type === \cf7 \strokec7 "event_callback"\cf4 \strokec4  &&\
    event?.type === \cf7 \strokec7 "reaction_added"\cf4 \strokec4  &&\
    event\cf6 \strokec6 .\cf4 \strokec4 reaction === \cf7 \strokec7 "reportinprogress"\cf4 \strokec4 \
  \cf6 \strokec6 )\cf4 \strokec4  \cf6 \strokec6 \{\cf4 \strokec4 \
    \cf2 \strokec2 try\cf4 \strokec4  \cf6 \strokec6 \{\cf4 \strokec4 \
      \cf2 \strokec2 const\cf4 \strokec4  channel  = event\cf6 \strokec6 .\cf4 \strokec4 item\cf6 \strokec6 .\cf4 \strokec4 channel\cf6 \strokec6 ;\cf4 \strokec4 \
      \cf2 \strokec2 const\cf4 \strokec4  threadTs = event\cf6 \strokec6 .\cf4 \strokec4 item\cf6 \strokec6 .\cf4 \strokec4 ts\cf6 \strokec6 ;\cf4 \strokec4 \
      \cf2 \strokec2 const\cf4 \strokec4  threadUrl = \cf7 \strokec7 `https://slack.com/archives/\cf6 \strokec6 $\{\cf7 \strokec7 channel\cf6 \strokec6 \}\cf7 \strokec7 /p\cf6 \strokec6 $\{\cf7 \strokec7 threadTs\cf6 \strokec6 .\cf5 \strokec5 replace\cf6 \strokec6 (\cf7 \strokec7 "."\cf6 \strokec6 ,\cf7 \strokec7  ""\cf6 \strokec6 )\}\cf7 \strokec7 `\cf6 \strokec6 ;\cf4 \strokec4 \
      \cf2 \strokec2 await\cf4 \strokec4  \cf5 \strokec5 handleBugReport\cf6 \strokec6 (\{\cf4 \strokec4  channel\cf6 \strokec6 ,\cf4 \strokec4  threadTs\cf6 \strokec6 ,\cf4 \strokec4  threadUrl \cf6 \strokec6 \});\cf4 \strokec4 \
    \cf6 \strokec6 \}\cf4 \strokec4  \cf2 \strokec2 catch\cf4 \strokec4  \cf6 \strokec6 (\cf4 \strokec4 err\cf6 \strokec6 )\cf4 \strokec4  \cf6 \strokec6 \{\cf4 \strokec4 \
      \cf11 \strokec11 console\cf6 \strokec6 .\cf5 \strokec5 error\cf6 \strokec6 (\cf7 \strokec7 "Emoji trigger error:"\cf6 \strokec6 ,\cf4 \strokec4  err\cf6 \strokec6 .\cf4 \strokec4 message\cf6 \strokec6 );\cf4 \strokec4 \
    \cf6 \strokec6 \}\cf4 \strokec4 \
  \cf6 \strokec6 \}\cf4 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf6 \strokec6 \});\cf4 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf8 \strokec8 // \uc0\u9472 \u9472 \u9472  ROUTE: Slash command (/bugreport) \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \cf4 \strokec4 \
app\cf6 \strokec6 .\cf5 \strokec5 post\cf6 \strokec6 (\cf7 \strokec7 "/slack/command"\cf6 \strokec6 ,\cf4 \strokec4  \cf2 \strokec2 async\cf4 \strokec4  \cf6 \strokec6 (\cf9 \strokec9 req\cf6 \strokec6 ,\cf9 \strokec9  res\cf6 \strokec6 )\cf4 \strokec4  => \cf6 \strokec6 \{\cf4 \strokec4 \
  \cf2 \strokec2 if\cf4 \strokec4  \cf6 \strokec6 (\cf4 \strokec4 !\cf5 \strokec5 verifySlack\cf6 \strokec6 (\cf4 \strokec4 req\cf6 \strokec6 ,\cf4 \strokec4  res\cf6 \strokec6 ))\cf4 \strokec4  \cf2 \strokec2 return\cf6 \strokec6 ;\cf4 \strokec4 \
\
  \cf8 \strokec8 // Acknowledge immediately with a temporary message\cf4 \strokec4 \
  res\cf6 \strokec6 .\cf5 \strokec5 json\cf6 \strokec6 (\{\cf4 \strokec4  \cf12 \strokec12 response_type\cf4 \strokec4 : \cf7 \strokec7 "ephemeral"\cf6 \strokec6 ,\cf4 \strokec4  \cf12 \strokec12 text\cf4 \strokec4 : \cf7 \strokec7 "\uc0\u9203  Creating bug ticket\'85"\cf4 \strokec4  \cf6 \strokec6 \});\cf4 \strokec4 \
\
  \cf2 \strokec2 try\cf4 \strokec4  \cf6 \strokec6 \{\cf4 \strokec4 \
    \cf2 \strokec2 const\cf4 \strokec4  \cf6 \strokec6 \{\cf4 \strokec4  channel_id\cf6 \strokec6 ,\cf4 \strokec4  text\cf6 \strokec6 ,\cf4 \strokec4  thread_ts\cf6 \strokec6 ,\cf4 \strokec4  response_url \cf6 \strokec6 \}\cf4 \strokec4  = req\cf6 \strokec6 .\cf4 \strokec4 body\cf6 \strokec6 ;\cf4 \strokec4 \
\
    \cf2 \strokec2 let\cf4 \strokec4  channel  = channel_id\cf6 \strokec6 ;\cf4 \strokec4 \
    \cf2 \strokec2 let\cf4 \strokec4  threadTs = thread_ts\cf6 \strokec6 ;\cf4 \strokec4  \cf8 \strokec8 // works when run inside a thread\cf4 \strokec4 \
\
    \cf8 \strokec8 // If a thread URL was pasted, parse channel + ts from it\cf4 \strokec4 \
    \cf8 \strokec8 // e.g. https://yourworkspace.slack.com/archives/C12345/p1234567890123456\cf4 \strokec4 \
    \cf2 \strokec2 const\cf4 \strokec4  urlMatch = text?.\cf5 \strokec5 match\cf6 \strokec6 (\cf13 \strokec13 /archives\\/([A-Z0-9]+)\\/p(\\d+)/\cf6 \strokec6 );\cf4 \strokec4 \
    \cf2 \strokec2 if\cf4 \strokec4  \cf6 \strokec6 (\cf4 \strokec4 urlMatch\cf6 \strokec6 )\cf4 \strokec4  \cf6 \strokec6 \{\cf4 \strokec4 \
      channel  = urlMatch\cf6 \strokec6 [\cf10 \strokec10 1\cf6 \strokec6 ];\cf4 \strokec4 \
      \cf2 \strokec2 const\cf4 \strokec4  raw = urlMatch\cf6 \strokec6 [\cf10 \strokec10 2\cf6 \strokec6 ];\cf4 \strokec4            \cf8 \strokec8 // 16-digit string\cf4 \strokec4 \
      threadTs = raw\cf6 \strokec6 .\cf5 \strokec5 slice\cf6 \strokec6 (\cf10 \strokec10 0\cf6 \strokec6 ,\cf4 \strokec4  \cf10 \strokec10 10\cf6 \strokec6 )\cf4 \strokec4  + \cf7 \strokec7 "."\cf4 \strokec4  + raw\cf6 \strokec6 .\cf5 \strokec5 slice\cf6 \strokec6 (\cf10 \strokec10 10\cf6 \strokec6 );\cf4 \strokec4  \cf8 \strokec8 // \uc0\u8594  unix.microseconds\cf4 \strokec4 \
    \cf6 \strokec6 \}\cf4 \strokec4 \
\
    \cf2 \strokec2 if\cf4 \strokec4  \cf6 \strokec6 (\cf4 \strokec4 !threadTs\cf6 \strokec6 )\cf4 \strokec4  \cf6 \strokec6 \{\cf4 \strokec4 \
      \cf2 \strokec2 await\cf4 \strokec4  axios\cf6 \strokec6 .\cf5 \strokec5 post\cf6 \strokec6 (\cf4 \strokec4 response_url\cf6 \strokec6 ,\cf4 \strokec4  \cf6 \strokec6 \{\cf4 \strokec4 \
        \cf12 \strokec12 response_type\cf4 \strokec4 : \cf7 \strokec7 "ephemeral"\cf6 \strokec6 ,\cf4 \strokec4 \
        \cf12 \strokec12 text\cf4 \strokec4 : \cf7 \strokec7 "\uc0\u9888 \u65039  Run this command inside a thread, or paste a thread URL after the command."\cf6 \strokec6 ,\cf4 \strokec4 \
      \cf6 \strokec6 \});\cf4 \strokec4 \
      \cf2 \strokec2 return\cf6 \strokec6 ;\cf4 \strokec4 \
    \cf6 \strokec6 \}\cf4 \strokec4 \
\
    \cf2 \strokec2 const\cf4 \strokec4  threadUrl = \cf7 \strokec7 `https://slack.com/archives/\cf6 \strokec6 $\{\cf7 \strokec7 channel\cf6 \strokec6 \}\cf7 \strokec7 /p\cf6 \strokec6 $\{\cf7 \strokec7 threadTs\cf6 \strokec6 .\cf5 \strokec5 replace\cf6 \strokec6 (\cf7 \strokec7 "."\cf6 \strokec6 ,\cf7 \strokec7  ""\cf6 \strokec6 )\}\cf7 \strokec7 `\cf6 \strokec6 ;\cf4 \strokec4 \
    \cf2 \strokec2 await\cf4 \strokec4  \cf5 \strokec5 handleBugReport\cf6 \strokec6 (\{\cf4 \strokec4  channel\cf6 \strokec6 ,\cf4 \strokec4  threadTs\cf6 \strokec6 ,\cf4 \strokec4  threadUrl\cf6 \strokec6 ,\cf4 \strokec4  \cf12 \strokec12 responseUrl\cf4 \strokec4 : response_url \cf6 \strokec6 \});\cf4 \strokec4 \
  \cf6 \strokec6 \}\cf4 \strokec4  \cf2 \strokec2 catch\cf4 \strokec4  \cf6 \strokec6 (\cf4 \strokec4 err\cf6 \strokec6 )\cf4 \strokec4  \cf6 \strokec6 \{\cf4 \strokec4 \
    \cf11 \strokec11 console\cf6 \strokec6 .\cf5 \strokec5 error\cf6 \strokec6 (\cf7 \strokec7 "Slash command error:"\cf6 \strokec6 ,\cf4 \strokec4  err\cf6 \strokec6 .\cf4 \strokec4 message\cf6 \strokec6 );\cf4 \strokec4 \
  \cf6 \strokec6 \}\cf4 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf6 \strokec6 \});\cf4 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf8 \strokec8 // \uc0\u9472 \u9472 \u9472  ROUTE: Interactivity placeholder (required by manifest) \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \cf4 \strokec4 \
app\cf6 \strokec6 .\cf5 \strokec5 post\cf6 \strokec6 (\cf7 \strokec7 "/slack/interactive"\cf6 \strokec6 ,\cf4 \strokec4  \cf6 \strokec6 (\cf9 \strokec9 req\cf6 \strokec6 ,\cf9 \strokec9  res\cf6 \strokec6 )\cf4 \strokec4  => res\cf6 \strokec6 .\cf5 \strokec5 sendStatus\cf6 \strokec6 (\cf10 \strokec10 200\cf6 \strokec6 ));\cf4 \strokec4 \
\
\cf8 \strokec8 // \uc0\u9472 \u9472 \u9472  Start \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \cf4 \strokec4 \
app\cf6 \strokec6 .\cf5 \strokec5 listen\cf6 \strokec6 (\cf10 \strokec10 PORT\cf6 \strokec6 ,\cf4 \strokec4  \cf6 \strokec6 ()\cf4 \strokec4  => \cf11 \strokec11 console\cf6 \strokec6 .\cf5 \strokec5 log\cf6 \strokec6 (\cf7 \strokec7 `BugReporter listening on port \cf6 \strokec6 $\{\cf10 \strokec10 PORT\cf6 \strokec6 \}\cf7 \strokec7 `\cf6 \strokec6 ));}