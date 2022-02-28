import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

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
export class Function extends Construct {
  /**
   * @summary Constructs a new instance of the Function class.
   * @param {Construct} scope - represents the scope for all the resources.
   * @param {string} id - this is a scope-unique id.
   * @param {FunctionProps} props - user provided properties for the construct.
   */
  constructor(scope: Construct, id: string, props: FunctionProps) {
    super(scope, id);

    new cdk.aws_lambda_nodejs.NodejsFunction(this, "nodejsFunction", {
      entry: props.entry,
      handler: props.handler ?? "handler",
    });
  }
}
