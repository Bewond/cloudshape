import { JTDSchemaType } from "ajv/dist/jtd";
/**
 * Function that processes the validated API request.
 */
export declare type APIFunction<RequestType, EnvironmentType> = {
    (request: RequestType, env: EnvironmentType): Promise<unknown>;
};
export interface APIEvent {
    /**
     * Optional body containing data.
     *
     * @default - none
     */
    body?: string;
}
export interface APIResult {
    /**
     * HTTP response status code.
     */
    statusCode: number;
    /**
     * Optional body containing data.
     *
     * @default - none
     */
    body?: string;
}
/**
 * @summary Data to initialize APIValidator.
 *
 * @see https://ajv.js.org/json-type-definition.html
 */
export interface APIValidatorData<RequestType, ResponseType, EnvironmentType> {
    /**
     * Schema used to validate the request.
     */
    requestSchema: JTDSchemaType<RequestType>;
    /**
     * Schema used to validate the response.
     */
    responseSchema: JTDSchemaType<ResponseType>;
    /**
     * Schema used to validate environment variables.
     */
    environmentSchema?: JTDSchemaType<EnvironmentType>;
}
/**
 * @summary Validator of an API handler.
 */
export declare class APIValidator<RequestType, ResponseType, EnvironmentType> {
    private readonly data;
    constructor(data: APIValidatorData<RequestType, ResponseType, EnvironmentType>);
    /**
     * Performs the handler function and the validation of the request, of the response
     * and optionally of the environment variables based on the provided schemas.
     *
     * @param event - API request event.
     * @param handler - function that processes the validated request.
     * @param environment - environment variables.
     * @returns the result of the handler's execution.
     */
    validate(event: APIEvent, handler: APIFunction<RequestType, EnvironmentType>, environment?: any): Promise<APIResult>;
}
//# sourceMappingURL=APIValidator.d.ts.map