#!/bin/bash

TARGET_FILENAME="schemas.ts"
TARGET_PATHNAME="lib/${TARGET_FILENAME}"
SOURCE_REPO_PATH=$1

if [ -z "$SOURCE_REPO_PATH" ]; then
    echo "Usage: $0 <source-repo-path>"
    exit 1
fi

cd "$(dirname "$0")/.."

echo "Syncing API schemas..."

echo "PWD: $(pwd)"

cp "${SOURCE_REPO_PATH}/apps/demo/src/lib/generated/schemas.ts" ${TARGET_PATHNAME}

{ echo -e "// !!! DO NOT MODIFY !!!\n// THIS FILE IS COPIED DIRECTLY FROM DEMO APP\n// Run script instead: \`pnpm run api:schema:sync\`"; cat $TARGET_PATHNAME; } > temp 

# Remove temp file and restore original file
rm $TARGET_PATHNAME
mv temp $TARGET_PATHNAME

# sed 's/@ecp\.eth\/sdk\/schemas/@ecp.eth\/sdk\/dist\/schemas/g' $TARGET_PATHNAME > temp
# rm $TARGET_PATHNAME
# mv temp $TARGET_PATHNAME

echo "Synced API schemas"