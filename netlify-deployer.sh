#!/bin/bash

if [ -z $NETLIF_OAUTH2_ACCESS_TOKEN ]; then
    echo "Set the Netlify Access Token in NETLIF_OAUTH2_ACCESS_TOKEN environment variable"
    exit -1
fi

# ------------------------------------------------------------------------------

SITE_ID=$1
HTML_FILE_ZIP=$2

function usage() {
    echo "$0 <site ID> <ZIP file path>"
    echo
}

if [ -z $SITE_ID ]; then
    echo "Missing the site ID"
    usage
    exit -1
fi

if [ -z $HTML_FILE_ZIP ]; then
    echo "Missing the ZIP file."
    exit -1
fi

# SITE=$(
#     curl -s \
#         -X GET \
#         -H "Authorization: Bearer $NETLIF_OAUTH2_ACCESS_TOKEN" \
#         "https://api.netlify.com/api/v1/sites/$SITE_ID"
# )

curl -s \
    -X POST \
    -H "Content-Type: application/zip" \
    -H "Authorization: Bearer $NETLIF_OAUTH2_ACCESS_TOKEN" \
    --data-binary "@$HTML_FILE_ZIP" \
    "https://api.netlify.com/api/v1/sites/$SITE_ID/deploys"
