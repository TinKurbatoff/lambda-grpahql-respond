#!/bin/bash
AWS_ID="438760693931" 
aws lambda create-function --function-name graphql-new-test --runtime nodejs16.x --role arn:aws:iam::$(AWS_ID):role/serverless-deploy-dev-us-east-2-lambdaRole --zip-file fileb://dist/graphql.zip --handler graphql.handler
