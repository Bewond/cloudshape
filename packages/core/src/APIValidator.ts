import { Schema, Validator } from "@cfworker/json-schema";

/**
 * Constructs a type with all properties of T set to optional or undefined.
 */
export type Draft<T> = {
  [P in keyof T]?: T[P] | undefined;
};

/**
 * Function that processes the validated API request.
 */
export type APIFunction<Request, Response, Environment> = {
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
 * @see https://json-schema.org/
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
export class APIValidator<RequestType, ResponseType, EnvironmentType> {
  private readonly data: APIValidatorData;

  constructor(data: APIValidatorData) {
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
  public async validate(
    event: APIEvent,
    handler: APIFunction<RequestType, ResponseType, EnvironmentType>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    environment?: any
  ): Promise<APIResult> {
    // Validate environment variables.
    if (environment && this.data.environmentSchema) {
      const validateEnvironment = new Validator(this.data.environmentSchema).validate(environment);

      if (!validateEnvironment.valid) {
        return this.result(500, validateEnvironment.errors);
      }
    }

    // Validate request.
    const request = JSON.parse(event.body ?? "{}");
    const validateRequest = new Validator(this.data.requestSchema).validate(request);

    if (validateRequest.valid) {
      let response = {};

      // Handle the API request.
      try {
        response = await handler(request, environment ?? {});
      } catch (error) {
        return this.result(500, error);
      }

      // Validate response.
      const validateResponse = new Validator(this.data.responseSchema).validate(response);

      if (validateResponse.valid) {
        return this.result(200, response);
      } else {
        return this.result(500, validateResponse.errors);
      }
    } else {
      return this.result(400, validateRequest.errors);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private result(code: number, body: any): APIResult {
    return {
      statusCode: code,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    };
  }
}
