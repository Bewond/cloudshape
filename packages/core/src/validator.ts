import Ajv, { JTDSchemaType } from "ajv/dist/jtd";

export type SchemaType<T> = JTDSchemaType<T>;

export type FunctionEnvironment = {
  [key: string]: string;
};

export type APIFunction<RequestType> = {
  (request: RequestType, env?: FunctionEnvironment): Promise<any>;
};

export interface APIEvent {
  body?: string;
}

export interface APIResult {
  statusCode: number;
  body?: string;
}

export function validateEventResult<RequestType, ResponseType, EnvironmentType>(
  event: APIEvent,
  requestSchema: JTDSchemaType<RequestType>,
  responseSchema: JTDSchemaType<ResponseType>,
  handler: APIFunction<RequestType>,
  environment?: FunctionEnvironment,
  environmentSchema?: JTDSchemaType<EnvironmentType>
): APIResult {
  const ajv = new Ajv();

  const request = JSON.parse(event.body ?? "{}");
  const validateRequest = ajv.compile(requestSchema);

  if (environment && environmentSchema) {
    const validateEnvironment = ajv.compile(environmentSchema);

    if (!validateEnvironment(environment)) {
      return {
        statusCode: 500,
        body: JSON.stringify(validateRequest.errors),
      };
    }
  }

  if (validateRequest(request)) {
    const response = handler(request, environment);
    const validateResponse = ajv.compile(responseSchema);

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
