"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = exports.UserPoolClient = void 0;
const authorizers = __importStar(require("@aws-cdk/aws-apigatewayv2-authorizers-alpha"));
const cognito = __importStar(require("aws-cdk-lib/aws-cognito"));
/**
 * UserPool App Client.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.UserPoolClient = cognito.UserPoolClient;
/**
 * @summary AWS Cognito UserPool construct.
 */
class Auth extends cognito.UserPool {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            ...props,
            selfSignUpEnabled: props.selfSignUpEnabled ?? false,
            signInAliases: props.signInAliases ?? { email: true },
            standardAttributes: props.standardAttributes ?? { email: { required: true, mutable: true } },
            lambdaTriggers: props.lambdaTriggers ?? {},
            signInCaseSensitive: props.signInCaseSensitive ?? false,
        });
    }
    /**
     * Create a user pool authorizer to be bound with HTTP route.
     */
    createAuthorizer(props) {
        return new authorizers.HttpUserPoolAuthorizer(`${this.userPoolId}UserPoolAuthorizer`, this, props);
    }
}
exports.Auth = Auth;
