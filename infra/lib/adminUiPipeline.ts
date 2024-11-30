import {
  PipelineProps,
  ReactPipelineBase,
} from '@youscience/aws-cdk-lib/lib/pipeline';
import { Construct } from 'constructs';

export class AdminUiPipeline extends ReactPipelineBase {
  constructor(scope: Construct, id: string, props: PipelineProps) {
    super(scope, id, {
      ...props,
      params: {},
    });
  }

  protected buildCommand(): string {
    return `npm run build:${this.deployStage}`;
  }
  installCommands(): string[] | undefined {
    return ['node --version', 'npm install -g aws-cdk', 'npm i --force', 'cd infra', 'npm i --force', 'cd ..'];
  }

  getProdStageName() {
    return 'production';
  }
}
