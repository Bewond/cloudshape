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
exports.API = exports.noneAuthorizer = exports.HttpMethod = void 0;
const gateway = __importStar(require("@aws-cdk/aws-apigatewayv2-alpha"));
const integrations = __importStar(require("@aws-cdk/aws-apigatewayv2-integrations-alpha"));
/**
 * Supported HTTP methods.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.HttpMethod = gateway.HttpMethod;
/**
 * Explicitly configure no authorizers on specific API routes.
 */
exports.noneAuthorizer = new gateway.HttpNoneAuthorizer();
/**
 * @summary API gateway construct.
 */
class API extends gateway.HttpApi {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            ...props,
            apiName: props.name ?? id,
            description: props.description ?? "",
            corsPreflight: props.cors ?? { allowOrigins: ["*"] },
        });
        this.id = id;
    }
    /**
     * Add API route.
     */
    addRoute(route) {
        const integration = new integrations.HttpLambdaIntegration(`${this.id}RouteIntegration`, route.handler);
        this.addRoutes({
            ...route,
            path: route.path,
            methods: [route.method],
            integration: integration,
        });
    }
}
exports.API = API;
//# sourceMappingURL=API.js.map