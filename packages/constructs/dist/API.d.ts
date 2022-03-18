import * as gateway from "@aws-cdk/aws-apigatewayv2-alpha";
import type * as lambda from "aws-cdk-lib/aws-lambda";
import type { Construct } from "constructs";
/**
 * Supported HTTP methods.
 */
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
export declare const noneAuthorizer: gateway.HttpNoneAuthorizer;
/**
 * @summary API gateway construct.
 */
export declare class API extends gateway.HttpApi {
    constructor(scope: Construct, id: string, props?: APIProps);
    /**
     * Add API route.
     */
    addRoute(route: APIRoute): void;
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
export declare class CustomDomain extends gateway.DomainName {
    constructor(scope: Construct, id: string, props: CustomDomainProps);
}
//# sourceMappingURL=API.d.ts.map