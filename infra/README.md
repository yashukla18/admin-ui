# Welcome to Resume Builder UI CDK TypeScript project

This is a insfrastructure project developed using TypeScript and AWS CDK constructs

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Prerequisites

Before any command set aws profile and login to the aws account using command line on the local machine

```
export AWS_PROFILE=ys-dev
```

```
aws sso login
```

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

For firstime deployment refer section [First time deployment](#first-time-deployment)

## Environment Variables that are needed for deployment

- `/apps/resume-builder-ui/env/stage`
- `/apps/resume-builder-ui/env/stagePrefix`
- `/apps/resume-builder-ui/source/repoName`
- `/apps/resume-builder-ui/source/branchName`

### Accounts

Environments (dev/staging/prod/sandbox) are determined by paramater store variable `/apps/shared/account/name` and it must be present in each account before deploy the pipeline.

| Filename         | Purpose                                                                       |
| ---------------- | ----------------------------------------------------------------------------- |
| env.yaml         | Default environment variables                                                 |
| env.dev.yaml     | Dev account environment variables                                             |
| env.stage.yaml   | Stage account environment variables                                           |
| env.prod.yaml    | Prod account environment variables                                            |
| env.sandbox.yaml | Sandbox account environment variables                                         |
| env.local.yaml   | Other than the above accounts, ys-test-\* can be configured as local accounts |

### Sync parameters

Parameters that are configured as `kind: param` will be synced to AWS parameter store during pipeline execution on respecitve account, But by default the sync process will not overwrite the params if it already exits but if needed the additional property `overwrite: true` will do the job on individual params.

#### First time deployment

Very first time the parameters to be synced on deploying account. Run the following command to sync parameters from config to aws param.

```lang=bash
npx ts-node node_modules/@youscience/aws-cdk-lib/lib/utils/syncParams.js profile=ys-dev path=/apps/admin-ui
```

After than run command

```
cdk deploy
```
