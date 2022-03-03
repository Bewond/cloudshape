import * as authorizers from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNode from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";
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
  readonly permissions?: Permission[] | Permission;
}

/**
 * @summary Nodejs AWS Lambda function construct.
 */
export class Function extends PermissionsMixin(lambdaNode.NodejsFunction) {
  constructor(scope: Construct, id: string, props: FunctionProps) {
    super(scope, id, {
      ...props,
      entry: props.entry,
      handler: props.handler ?? "handler",
      environment: props.environment ?? {},
      tracing: lambda.Tracing.ACTIVE,
      logRetention: logs.RetentionDays.SIX_MONTHS,
    });

    if (this.role) this.initializeMixin(this.role, this, `${id}PermissionsPolicy`);

    // Attach permissions after initialization.
    if (Array.isArray(props.permissions)) {
      this.attachPermissions(props.permissions);
    } else if (props.permissions) {
      this.attachPermissions([props.permissions]);
    }
  }

  /**
   * Create a lambda authorizer to be bound with HTTP route.
   */
  public createAuthorizer(
    props?: authorizers.HttpLambdaAuthorizerProps
  ): authorizers.HttpLambdaAuthorizer {
    return new authorizers.HttpLambdaAuthorizer(`${this.functionName}LambdaAuthorizer`, this, {
      ...props,
      responseTypes: props?.responseTypes ?? [authorizers.HttpLambdaResponseType.SIMPLE],
    });
  }
}
