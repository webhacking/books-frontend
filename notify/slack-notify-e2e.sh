#!/bin/bash

STATUS="$(cat .job_status)"
STAGE="$(cat .stage)"
ENV=${ENVIRONMENT:="development"}
BRANCH_NAME=${CI_COMMIT_REF_NAME:="NONE"}

[[ $STATUS = "FAIL" ]] && COLOR="#D93826" || COLOR="#5ABF0D"

if [ ${ENV} = "development" ]
then
   curl -X POST \
   -H 'Content-type: application/json' \
   --data '{
     "attachments": [{
     "title": "'"books.ridi.io"'",
     "text": "'"${CI_COMMIT_TITLE:="NONE"}"'",
     "color": "'"${COLOR}"'",
     "fields": [
        { "title": "Branch", "value": "'"${BRANCH_NAME}"'", "short": true },
        { "title": "Revision", "value": "'"${CI_COMMIT_SHA:="NONE"}"'", "short": true },
        { "title": "CI Stage", "value": "'"${STAGE}"'", "short": true },
        { "title": "JOB Result", "value": "'"${STATUS}"'", "short": true },
      ]
    }]
  }'\
  ${DEV_SLACK_WEB_HOOK}
elif [ ${ENV} = "production" ]
   curl -X POST \
   -H 'Content-type: application/json' \
   --data '{
     "attachments": [{
     "title": "'"books.ridibooks.com"'",
     "text": "'"${CI_COMMIT_TITLE:="NONE"}"'",
     "color": "'"${COLOR}"'",
     "fields": [
        { "title": "Branch", "value": "'"${BRANCH_NAME}"'", "short": true },
        { "title": "Revision", "value": "'"${CI_COMMIT_SHA:="NONE"}"'", "short": true },
        { "title": "CI Stage", "value": "'"${STAGE}"'", "short": true },
        { "title": "JOB Result", "value": "'"${STATUS}"'", "short": true },
      ]
    }]
  }'\
  ${PROD_SLACK_WEB_HOOK}
then
fi
