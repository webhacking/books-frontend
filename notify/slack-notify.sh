#!/bin/sh

STATUS="$(cat .job_status)"
STAGE="$(cat .stage)"
ENV=${ENVIRONMENT:="DEVELOPMENT"}

[[ $STATUS = "FAIL" ]] && COLOR="#D93826" || COLOR="#5ABF0D"


if [ ${ENV} = "DEVELOPMENT" ]
then
 curl -X POST \
   -H 'Content-type: application/json' \
   --data '{
     "attachments": [{
     "title": "'"books.ridi.io"'",
     "text": "'"${CI_COMMIT_TITLE:="NONE"}"'",
     "color": "'"${COLOR}"'",
     "fields": [
        { "title": "Branch", "value": "'"${CI_COMMIT_REF_NAME:="NONE"}"'", "short": true },
        { "title": "Revision", "value": "'"${CI_COMMIT_SHA:="NONE"}"'", "short": true },
        { "title": "CI Stage", "value": "'"${STAGE}"'", "short": true },
        { "title": "JOB Result", "value": "'"${STATUS}"'", "short": true },
      ]
    }]
  }'\
  ${DEV_SLACK_WEB_HOOK}
fi
