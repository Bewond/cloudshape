import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import type { Construct } from "constructs";

/**
 * The properties for the Function construct.
 */
export interface FunctionProps {
  /**
   * Path to the entry file (JavaScript or TypeScript).
   */
  readonly entry: string;

  /**
   * The name of the exported handler in the entry file.
   *
   * @default handler
   */
  readonly handler?: string;

  /**
   * Use environment variables to apply configuration changes, such
   * as test and production environment configurations, without changing your
   * Lambda function source code.
   *
   * @default - No environment variables.
   */
  readonly environment?: {
    [key: string]: string;
  };
}

/**
 * @summary Nodejs AWS Lambda function construct.
 */
export class Function extends lambda.NodejsFunction {
  constructor(scope: Construct, id: string, props: FunctionProps) {
    super(scope, id, {
      ...props,
      entry: props.entry,
      handler: props.handler ?? "handler",
      environment: props.environment ?? {},
    });
  }
}
