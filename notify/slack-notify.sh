#!/bin/sh
STATUS="$(cat .job_status)"
STAGE="$(cat .stage)"
ENV=${ENVIRONMENT:="development"}
BRANCH_NAME=${CI_COMMIT_REF_NAME:="NONE"}
COMMIT_TITLE=${CI_COMMIT_TITLE:="NONE"}

[[ $STATUS = "FAIL" ]] && COLOR="#D93826" || COLOR="#5ABF0D"

# on Jest testing failed
if [ $STAGE = "TEST" ] && [ $STATUS = "FAIL" ]
then
  curl -X POST \
    -H 'Content-type: application/json' -d @- ${DEV_SLACK_WEB_HOOK} <<EOF
{
  "attachments": [{
    "title": "books.ridi.io",
    "text": "${COMMIT_TITLE}",
    "color": "#D93826",
    "fields": [
      { "title": "Branch", "value": "${BRANCH_NAME}", "short": true },
      { "title": "Revision", "value": "${CI_COMMIT_SHA:="NONE"}", "short": true },
      { "title": "CI Stage", "value": "${STAGE}", "short": true },
      { "title": "Job Result", "value": "${STATUS}", "short": true }
    ]
  }]
}
EOF
elif [ ${ENV} = "development" ] && [ $STAGE != "TEST" ]
then
  curl -X POST \
    -H 'Content-type: application/json' -d @- ${DEV_SLACK_WEB_HOOK} <<EOF
{
  "attachments": [{
    "title": "books.ridi.io",
    "text": "${COMMIT_TITLE}",
    "color": "${COLOR}",
    "fields": [
      { "title": "Branch", "value": "${BRANCH_NAME}", "short": true },
      { "title": "Revision", "value": "${CI_COMMIT_SHA:="NONE"}", "short": true },
      { "title": "CI Stage", "value": "${STAGE}", "short": true },
      { "title": "JOB Result", "value": "${STATUS}", "short": true }
    ]
  }]
}
EOF
elif [ ${ENV} = "production" ]
then
  curl -X POST \
    -H 'Content-type: application/json' -d @- ${PROD_SLACK_WEB_HOOK} <<EOF
{
  "attachments": [{
    "title": "books.ridibooks.com",
    "text": "${COMMIT_TITLE}",
    "color": "${COLOR}",
    "fields": [
       { "title": "Branch", "value": "${BRANCH_NAME}", "short": true },
       { "title": "Revision", "value": "${CI_COMMIT_SHA:="NONE"}", "short": true },
       { "title": "CI Stage", "value": "${STAGE}", "short": true },
       { "title": "JOB Result", "value": "${STATUS}", "short": true }
    ],
  }],
  "blocks": [{
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": $(
        git log origin/master^1..origin/master \
          --no-merges --pretty=format:'* `%h` %s (%an, %cr)' |
          node -- "$(dirname -- "$0")/stdin-to-json.js"
      )
    }
  }]
}
EOF
fi
