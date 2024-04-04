#!/bin/bash

source .env

platform="osx-arm64"

yarn create_env_installer:$platform
yarn extract_env_installer:$platform

security create-keychain -p $ENV_INSTALLER_KEYCHAIN_PASS build.keychain
security default-keychain -s build.keychain
security unlock-keychain -p $ENV_INSTALLER_KEYCHAIN_PASS build.keychain
security import $CSC_LINK -k build.keychain -P $CSC_KEY_PASSWORD -T /usr/bin/codesign
security set-key-partition-list -S apple-tool:,apple:,codesign: -s -k $ENV_INSTALLER_KEYCHAIN_PASS build.keychain
echo "Signing env binaries"
while read line; do /usr/bin/codesign --force --options=runtime --deep -s "Developer ID Application" ./env_installer/jlab_server_extracted/"$line" -v; done < ./env_installer/sign-$platform.txt

security delete-keychain build.keychain

yarn compress_env_installer:$platform
#rm -rf ./env_installer/jlab_server_extracted

yarn dist:$platform

