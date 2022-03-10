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
exports.Function = void 0;
const authorizers = __importStar(require("@aws-cdk/aws-apigatewayv2-authorizers-alpha"));
const lambda = __importStar(require("aws-cdk-lib/aws-lambda"));
const lambdaNode = __importStar(require("aws-cdk-lib/aws-lambda-nodejs"));
const logs = __importStar(require("aws-cdk-lib/aws-logs"));
const Permissions_1 = require("./Permissions");
/**
 * @summary Nodejs AWS Lambda function construct.
 */
class Function extends (0, Permissions_1.PermissionsMixin)(lambdaNode.NodejsFunction) {
    constructor(scope, id, props) {
        super(scope, id, {
            ...props,
            entry: props.entry,
            tracing: lambda.Tracing.ACTIVE,
            logRetention: logs.RetentionDays.SIX_MONTHS,
        });
        if (this.role)
            this.initializeMixin(this.role, this, `${id}PermissionsPolicy`);
        // Attach permissions after initialization.
        if (Array.isArray(props.permissions)) {
            this.attachPermissions(props.permissions);
        }
        else if (props.permissions) {
            this.attachPermissions([props.permissions]);
        }
    }
    /**
     * Create a lambda authorizer to be bound with HTTP route.
     */
    createAuthorizer(props) {
        return new authorizers.HttpLambdaAuthorizer(`${this.functionName}LambdaAuthorizer`, this, {
            ...props,
            responseTypes: props?.responseTypes ?? [authorizers.HttpLambdaResponseType.SIMPLE],
        });
    }
}
exports.Function = Function;
//# sourceMappingURL=Function.js.map