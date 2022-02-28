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
}

/**
 * @summary Nodejs AWS Lambda function construct.
 */
export class Function extends lambda.NodejsFunction {
  constructor(scope: Construct, id: string, props: FunctionProps) {
    super(scope, id, {
      entry: props.entry,
      handler: props.handler ?? "handler",
    });
  }
}
