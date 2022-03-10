import { JTDSchemaType } from "ajv/dist/jtd";
/**
 * Constructs a type with all properties of T set to optional or undefined.
 */
export declare type Draft<T> = {
    [P in keyof T]?: T[P] | undefined;
};
/**
 * Function that processes the validated API request.
 */
export declare type APIFunction<Request, Response, Environment> = {
    (request: Request, env: Environment): Promise<Draft<Response>>;
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
     * HTTP header fields.
     */
    headers?: {
        [header: string]: string;
    };
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
export interface APIValidatorData<Request, Response, Environment> {
    /**
     * Schema used to validate the request.
     */
    requestSchema: JTDSchemaType<Request>;
    /**
     * Schema used to validate the response.
     */
    responseSchema: JTDSchemaType<Response>;
    /**
     * Schema used to validate environment variables.
     */
    environmentSchema?: JTDSchemaType<Environment>;
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
    validate(event: APIEvent, handler: APIFunction<RequestType, ResponseType, EnvironmentType>, environment?: any): Promise<APIResult>;
    private result;
}
//# sourceMappingURL=APIValidator.d.ts.map