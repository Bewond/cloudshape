"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIValidator = void 0;
const jtd_1 = __importDefault(require("ajv/dist/jtd"));
/**
 * @summary Validator of an API handler.
 */
class APIValidator {
    constructor(data) {
        this.data = data;
    }
    /**
     * Performs the handler function and the validation of the request, of the response
     * and optionally of the environment variables based on the provided schemas.
     *
     * @param event - API request event.
     * @param handler - function that processes the validated request.
     * @param environment - environment variables.
     * @returns the result of the handler's execution.
     */
    async validate(event, handler, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    environment) {
        const ajv = new jtd_1.default();
        // Validate environment variables.
        if (environment && this.data.environmentSchema) {
            const validateEnvironment = ajv.compile(this.data.environmentSchema);
            if (!validateEnvironment(environment)) {
                return {
                    statusCode: 500,
                    body: JSON.stringify(validateEnvironment.errors),
                };
            }
        }
        // Validate request.
        const request = JSON.parse(event.body ?? "{}");
        const validateRequest = ajv.compile(this.data.requestSchema);
        if (validateRequest(request)) {
            // Validate response.
            const response = await handler(request, environment ?? {});
            const validateResponse = ajv.compile(this.data.responseSchema);
            if (validateResponse(response)) {
                return {
                    statusCode: 200,
                    body: JSON.stringify(response),
                };
            }
            else {
                return {
                    statusCode: 500,
                    body: JSON.stringify(validateResponse.errors),
                };
            }
        }
        else {
            return {
                statusCode: 400,
                body: JSON.stringify(validateRequest.errors),
            };
        }
    }
}
exports.APIValidator = APIValidator;
