import * as authorizers from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import * as cognito from "aws-cdk-lib/aws-cognito";
import type { Construct } from "constructs";
/**
 * UserPool App Client.
 */
export import UserPoolClient = cognito.UserPoolClient;
/**
 * The properties for the Auth construct.
 */
export interface AuthProps {
    /**
     * Whether self sign up should be enabled.
     *
     * @default false
     */
    readonly selfSignUpEnabled?: boolean;
    /**
     * Methods in which a user registers or signs in to a user pool.
     *
     * @default { email: true }
     */
    readonly signInAliases?: cognito.SignInAliases;
    /**
     * The set of attributes that are required for every user in the user pool.
     *
     * @default - Email required, other standard attributes are optional and mutable.
     */
    readonly standardAttributes?: cognito.StandardAttributes;
    /**
     * Lambda functions to use for supported Cognito triggers.
     *
     * @default - No Lambda triggers.
     */
    readonly lambdaTriggers?: cognito.UserPoolTriggers;
    /**
     * Whether sign-in aliases should be evaluated with case sensitivity.
     *
     * @default false
     */
    readonly signInCaseSensitive?: boolean;
}
/**
 * @summary AWS Cognito UserPool construct.
 */
export declare class Auth extends cognito.UserPool {
    constructor(scope: Construct, id: string, props?: AuthProps);
    /**
     * Create a user pool authorizer to be bound with HTTP route.
     */
    createAuthorizer(props?: authorizers.HttpUserPoolAuthorizerProps): authorizers.HttpUserPoolAuthorizer;
}
//# sourceMappingURL=Auth.d.ts.map