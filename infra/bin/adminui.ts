#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { AdminUiPipeline } from '../lib/adminUiPipeline';

const app = new App();

const env = {
  account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
};

const pipeline = new AdminUiPipeline(app, 'AdminUiPipeline', {
  env: env,
  pipelineId: 'AdminUiPipeline',
  pipelineName: 'admin-ui-pipeline',
  params: {},
});
