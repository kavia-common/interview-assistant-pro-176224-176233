#!/bin/bash
cd /home/kavia/workspace/code-generation/interview-assistant-pro-176224-176233/react_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

