import Ajv, { JTDSchemaType } from "ajv/dist/jtd";

/**
 * Function that processes the validated API request.
 */
export type APIFunction<RequestType, EnvironmentType> = {
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
    handler: APIFunction<RequestType, EnvironmentType>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    environment?: any
  ): Promise<APIResult> {
    const ajv = new Ajv();

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
      } else {
        return {
          statusCode: 500,
          body: JSON.stringify(validateResponse.errors),
        };
      }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify(validateRequest.errors),
      };
    }
  }
}
