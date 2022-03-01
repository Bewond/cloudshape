import * as gateway from "@aws-cdk/aws-apigatewayv2-alpha";
import * as integrations from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import type * as lambda from "aws-cdk-lib/aws-lambda";
import type { Construct } from "constructs";

/**
 * Supported HTTP methods
 */
export import HttpMethod = gateway.HttpMethod;

/**
 * The properties for the API construct.
 */
export interface APIProps {
  /**
   * Name for the API resource.
   *
   * @default - id of the HttpApi construct.
   */
  readonly name?: string;

  /**
   * The description of the API.
   *
   * @default - none
   */
  readonly description?: string;

  /**
   * Specifies a CORS configuration.
   *
   * @default { allowOrigins: ["*"] }
   */
  readonly cors?: gateway.CorsPreflightOptions;
}

/**
 * @summary API gateway construct.
 */
export class API extends gateway.HttpApi {
  constructor(scope: Construct, id: string, props: APIProps = {}) {
    super(scope, id, {
      ...props,
      apiName: props.name ?? id,
      description: props.description ?? "",
      corsPreflight: props.cors ?? { allowOrigins: ["*"] },
    });
  }

  /**
   * Add API route.
   */
  addRoute(path: string, method: HttpMethod, handler: lambda.IFunction): void {
    this.addRoutes({
      path: path,
      methods: [method],
      integration: new integrations.HttpLambdaIntegration(`${this.apiId}RouteIntegration`, handler),
    });
  }
}
