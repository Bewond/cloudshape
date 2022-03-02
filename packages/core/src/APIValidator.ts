import Ajv, { JTDSchemaType } from "ajv/dist/jtd";

export type SchemaType<T> = JTDSchemaType<T>;

export type APIFunction<RequestType, EnvironmentType> = {
  (request: RequestType, env: EnvironmentType): Promise<unknown>;
};

export interface APIEvent {
  body?: string;
}

export interface APIResult {
  statusCode: number;
  body?: string;
}

export interface APIValidatorData<RequestType, ResponseType, EnvironmentType> {
  requestSchema: JTDSchemaType<RequestType>;
  responseSchema: JTDSchemaType<ResponseType>;
  environmentSchema?: JTDSchemaType<EnvironmentType>;
}

export class APIValidator<RequestType, ResponseType, EnvironmentType> {
  private readonly data: APIValidatorData<RequestType, ResponseType, EnvironmentType>;

  constructor(data: APIValidatorData<RequestType, ResponseType, EnvironmentType>) {
    this.data = data;
  }

  public validate(
    event: APIEvent,
    handler: APIFunction<RequestType, EnvironmentType>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    environment?: any
  ): APIResult {
    const ajv = new Ajv();

    const request = JSON.parse(event.body ?? "{}");
    const validateRequest = ajv.compile(this.data.requestSchema);

    if (environment && this.data.environmentSchema) {
      const validateEnvironment = ajv.compile(this.data.environmentSchema);

      if (!validateEnvironment(environment)) {
        return {
          statusCode: 500,
          body: JSON.stringify(validateRequest.errors),
        };
      }
    }

    if (validateRequest(request)) {
      const response = handler(request, environment ?? {});
      const validateResponse = ajv.compile(this.data.responseSchema);

      if (validateResponse(response)) {
        return {
          statusCode: 200,
          body: JSON.stringify(response),
        };
      } else {
        return {
          statusCode: 500,
          body: JSON.stringify(validateRequest.errors),
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
