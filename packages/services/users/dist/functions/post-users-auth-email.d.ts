import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { Schema } from "@cfworker/json-schema";
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
 * @see TODO
 */
export interface APIValidatorData {
    /**
     * Schema used to validate the request.
     */
    requestSchema: Schema;
    /**
     * Schema used to validate the response.
     */
    responseSchema: Schema;
    /**
     * Schema used to validate environment variables.
     */
    environmentSchema?: Schema;
}
/**
 * @summary Validator of an API handler.
 */
export declare class APIValidator<RequestType, ResponseType, EnvironmentType> {
    private readonly data;
    constructor(data: APIValidatorData);
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
export declare const handler: (event: APIGatewayProxyEventV2) => Promise<APIGatewayProxyResultV2>;
//# sourceMappingURL=post-users-auth-email.d.ts.map