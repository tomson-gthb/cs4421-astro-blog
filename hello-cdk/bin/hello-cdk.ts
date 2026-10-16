#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { HelloEcsStack } from '../lib/hello-cdk-stack';

const app = new cdk.App();


// Instantiate the ECS stack for  SSR container blog
new HelloEcsStack(app, 'HelloEcsStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});


