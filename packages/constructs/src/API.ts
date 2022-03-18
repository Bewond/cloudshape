import * as gateway from "@aws-cdk/aws-apigatewayv2-alpha";
import * as integrations from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import type * as lambda from "aws-cdk-lib/aws-lambda";
import type { Construct } from "constructs";

/**
 * Supported HTTP methods.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export import HttpMethod = gateway.HttpMethod;

/**
 * Route data for API Gateway.
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
 * Properties for the API construct.
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
   * Configure a custom domain.
   *
   * @default - no domain mapping
   */
  readonly defaultDomainMapping?: gateway.DomainMappingOptions;

  /**
   * Default Authorizer to applied to all routes.
   *
   * @default - no authorizer
   */
  readonly defaultAuthorizer?: gateway.IHttpRouteAuthorizer;
}

/**
 * Explicitly configure no authorizers on specific API routes.
 */
export const noneAuthorizer = new gateway.HttpNoneAuthorizer();

/**
 * @summary API gateway construct.
 */
export class API extends gateway.HttpApi {
  constructor(scope: Construct, id: string, props: APIProps = {}) {
    super(scope, id, {
      ...props,
      apiName: props.name ?? id,
      corsPreflight: props.cors ?? { allowOrigins: ["*"] },
    });
  }

  /**
   * Add API route.
   */
  addRoute(route: APIRoute): void {
    const integration = new integrations.HttpLambdaIntegration(
      `${this.httpApiName}RouteIntegration`,
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

/**
 * Properties for the CustomDomain construct.
 */
export interface CustomDomainProps {
  /**
   * The domain name.
   */
  readonly name: string;

  /**
   * Domain certificate ARN.
   */
  readonly certificateArn: string;
}

export class CustomDomain extends gateway.DomainName {
  constructor(scope: Construct, id: string, props: CustomDomainProps) {
    super(scope, id, {
      domainName: props.name,
      certificate: acm.Certificate.fromCertificateArn(
        scope,
        `${id}DomainCertificate`,
        props.certificateArn
      ),
    });
  }
}
