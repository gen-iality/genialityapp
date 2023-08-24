#!/bin/bash

FILENAME=$1

if [ -z $FILENAME ];
then
	echo "Missing the envvar file."
	exit -1
fi


while IFS= read -r line;
do
	LINE=$(echo "$line" | tr -d ' ')
	if [[ -n "$LINE" && "$LINE" != "#"* ]];
	then
		NAME="${LINE%%=*}"
		VALUE="${LINE#*=}"
		# Remove quotes
		VALUE="${VALUE%\"}"
		VALUE="${VALUE#\"}"
		VALUE="${VALUE%\'}"
		VALUE="${VALUE#\'}"
		export "$NAME"="$VALUE"
	fi
done < "$FILENAME"

echo done
