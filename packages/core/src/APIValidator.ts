import Ajv, { JTDSchemaType } from "ajv/dist/jtd";

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
export class APIValidator<RequestType, ResponseType, EnvironmentType> {
  private readonly data: APIValidatorData<RequestType, ResponseType, EnvironmentType>;

  constructor(data: APIValidatorData<RequestType, ResponseType, EnvironmentType>) {
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
    const ajv = new Ajv();

    // Validate environment variables.
    if (environment && this.data.environmentSchema) {
      const validateEnvironment = ajv.compile(this.data.environmentSchema);

      if (!validateEnvironment(environment)) {
        return this.result(500, validateEnvironment.errors);
      }
    }

    // Validate request.
    const request = JSON.parse(event.body ?? "{}");
    const validateRequest = ajv.compile(this.data.requestSchema);

    if (validateRequest(request)) {
      let response = {};

      // Handle the API request.
      try {
        response = await handler(request, environment ?? {});
      } catch (error) {
        return this.result(500, error);
      }

      // Validate response.
      const validateResponse = ajv.compile(this.data.responseSchema);

      if (validateResponse(response)) {
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
