#!/bin/bash
aws lambda update-function-code --function-name graphql-new-test --zip-file fileb://dist/graphql.zip
