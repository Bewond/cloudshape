import * as gateway from "@aws-cdk/aws-apigatewayv2-alpha";
import * as integrations from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import type * as lambda from "aws-cdk-lib/aws-lambda";
import type { Construct } from "constructs";

/**
 * Supported HTTP methods.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export import HttpMethod = gateway.HttpMethod;

/**
 * Route properties for API Gateway.
 */
export interface APIRoute {
  /**
   * Route path.
   */
  readonly path: string;

  /**
   * HTTP method to configure.
   */
  readonly method: gateway.HttpMethod;

  /**
   * Handler Lambda function.
   */
  readonly handler: lambda.IFunction;

  /**
   * Authorizer.
   *
   * @default - uses the default authorizer if one is specified.
   */
  readonly authorizer?: gateway.IHttpRouteAuthorizer;
}

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
   * Description of the API.
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

  /**
   * Default Authorizer to applied to all routes.
   *
   * @default - No authorizer
   */
  readonly defaultAuthorizer?: gateway.IHttpRouteAuthorizer;
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
  addRoute(route: APIRoute): void {
    const integration = new integrations.HttpLambdaIntegration(
      `${this.apiId}RouteIntegration`,
      route.handler
    );

    this.addRoutes({
      ...route,
      path: route.path,
      methods: [route.method],
      integration: integration,
    });
  }
}
