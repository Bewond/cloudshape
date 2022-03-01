import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import type { Construct } from "constructs";
import { Permission, PermissionsMixin } from "./Permissions";

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

  /**
   * Permissions for actions on resources.
   * 
   * @default - none
   */
  readonly permissions?: Permission[];
}

/**
 * @summary Nodejs AWS Lambda function construct.
 */
export class Function extends PermissionsMixin(lambda.NodejsFunction) {
  constructor(scope: Construct, id: string, props: FunctionProps) {
    super(scope, id, {
      ...props,
      entry: props.entry,
      handler: props.handler ?? "handler",
      environment: props.environment ?? {},
    });

    this.initializeMixin(this.role!, this, `${id}PermissionsPolicy`);

    // Attach permissions after initialization.
    if (props.permissions) {
      this.attachPermissions(props.permissions);
    }
  }
}
