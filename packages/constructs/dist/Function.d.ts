import * as authorizers from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import * as lambdaNode from "aws-cdk-lib/aws-lambda-nodejs";
import type { Construct } from "constructs";
import { Permission } from "./Permissions";
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
declare const Function_base: {
    new (...args: any[]): {
        [x: string]: any;
        constructRole?: import("aws-cdk-lib/aws-iam").Role;
        policyScope?: Construct;
        policyId?: string;
        initializeMixin(constructRole: import("aws-cdk-lib/aws-iam").Role | import("aws-cdk-lib/aws-iam").IRole, policyScope: Construct, policyId: string): void;
        attachPermissions(permissions: Permission[]): void;
    };
} & typeof lambdaNode.NodejsFunction;
/**
 * @summary Nodejs AWS Lambda function construct.
 */
export declare class Function extends Function_base {
    constructor(scope: Construct, id: string, props: FunctionProps);
    /**
     * Create a lambda authorizer to be bound with HTTP route.
     */
    createAuthorizer(props?: authorizers.HttpLambdaAuthorizerProps): authorizers.HttpLambdaAuthorizer;
}
export {};
//# sourceMappingURL=Function.d.ts.map