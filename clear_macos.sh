#!/bin/bash

rm -f /usr/local/bin/jlab # remove command symlink

# to remove application cache and bundled Python environment
rm -rf ~/Library/mljar-studio
# to remove user data
rm -rf ~/Library/Application\ Support/mljar-studio
# to remove logs
rm -rf ~/Library/Logs/mljar-studio

rm -rf /Applications/mljar-studio.app