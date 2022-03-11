"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIValidator = void 0;
const json_schema_1 = require("@cfworker/json-schema");
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
        // Validate environment variables.
        if (environment && this.data.environmentSchema) {
            const validateEnvironment = new json_schema_1.Validator(this.data.environmentSchema).validate(environment);
            if (!validateEnvironment.valid) {
                return this.result(500, validateEnvironment.errors);
            }
        }
        // Validate request.
        const request = JSON.parse(event.body ?? "{}");
        const validateRequest = new json_schema_1.Validator(this.data.requestSchema).validate(request);
        if (validateRequest.valid) {
            let response = {};
            // Handle the API request.
            try {
                response = await handler(request, environment ?? {});
            }
            catch (error) {
                return this.result(500, error);
            }
            // Validate response.
            const validateResponse = new json_schema_1.Validator(this.data.responseSchema).validate(response);
            if (validateResponse.valid) {
                return this.result(200, response);
            }
            else {
                return this.result(500, validateResponse.errors);
            }
        }
        else {
            return this.result(400, validateRequest.errors);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result(code, body) {
        return {
            statusCode: code,
            headers: { "content-type": "application/json" },
            body: JSON.stringify(body),
        };
    }
}
exports.APIValidator = APIValidator;
//# sourceMappingURL=APIValidator.js.map