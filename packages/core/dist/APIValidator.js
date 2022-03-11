"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIValidator = void 0;
const Validator_1 = require("./Validator");
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
            const testEnvironment = new Validator_1.Validator(this.data.environmentSchema).test(environment);
            if (!testEnvironment.valid) {
                return this.result(500, testEnvironment.errors);
            }
        }
        // Validate request.
        const request = JSON.parse(event.body ?? "{}");
        const testRequest = new Validator_1.Validator(this.data.requestSchema).test(request);
        if (testRequest.valid) {
            let response = {};
            // Handle the API request.
            try {
                response = await handler(request, environment ?? {});
            }
            catch (error) {
                return this.result(500, error);
            }
            // Validate response.
            const testResponse = new Validator_1.Validator(this.data.responseSchema).test(response);
            if (testResponse.valid) {
                return this.result(200, response);
            }
            else {
                return this.result(500, testResponse.errors);
            }
        }
        else {
            return this.result(400, testRequest.errors);
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