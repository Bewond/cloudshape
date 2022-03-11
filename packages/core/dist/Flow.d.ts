import { Schema } from "./Validator";
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
 * @summary Data to initialize Flow.
 */
export interface FlowData {
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
 * @summary Support class for API flow management.
 */
export declare class Flow<RequestType, ResponseType, EnvironmentType> {
    private readonly data;
    constructor(data: FlowData);
    /**
     * Performs the handler function and the validation of the request, of the response
     * and optionally of the environment variables based on the provided schemas.
     *
     * @param event - API request event.
     * @param handler - handler function.
     * @param environment - environment variables.
     * @returns API handler result.
     */
    start(event: APIEvent, handler: APIFunction<RequestType, ResponseType, EnvironmentType>, environment?: any): Promise<APIResult>;
    private result;
}
//# sourceMappingURL=Flow.d.ts.map