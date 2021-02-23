#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { InfraStack } from '../lib/infra-stack';

const stackProps = {
  env: {
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION
  }
};

const siteProps = {
  domainName: 'some-hsl-app.tk'
}

const app = new cdk.App();

new InfraStack(app, 'InfraStack', siteProps, stackProps);
