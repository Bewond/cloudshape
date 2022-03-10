//import { APIValidator, Draft } from "@cloudshape/core";
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import { randomBytes } from "crypto";

//

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

    console.log("OK1");

    // Validate environment variables.
    if (environment && this.data.environmentSchema) {
      const validateEnvironment = ajv.compile(this.data.environmentSchema);

      if (!validateEnvironment(environment)) {
        return this.result(500, validateEnvironment.errors);
      }
    }

    console.log("OK2");

    // Validate request.
    const request = JSON.parse(event.body ?? "{}");
    const validateRequest = ajv.compile(this.data.requestSchema);

    if (validateRequest(request)) {
      let response = {};

      console.log("OK3");

      // Handle the API request.
      try {
        response = await handler(request, environment ?? {});
      } catch (error) {
        return this.result(500, error);
      }

      console.log("OK4");

      // Validate response.
      const validateResponse = ajv.compile(this.data.responseSchema);

      if (validateResponse(response)) {
        console.log("OK5");
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
    console.log("WOW");
    return {
      statusCode: code,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    };
  }
}

//

interface Request {
  email: string;
}

interface Response {
  userId: string;
  email: string;
  session: string;
}

interface Environment {
  userPoolId: string;
  userPoolClientId: string;
}

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  console.log("event:", JSON.stringify(event, null, 2));

  /*const body = JSON.parse(event.body ?? "{}");
  const result = await main(
    { email: body["email"]! },
    {
      userPoolId: process.env["userPoolId"]!,
      userPoolClientId: process.env["userPoolClientId"]!,
    }
  );

  return {
    statusCode: 200,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(result),
  };*/

  const validator = new APIValidator<Request, Response, Environment>({
    requestSchema: {
      properties: {
        email: { type: "string" },
      },
    },
    responseSchema: {
      properties: {
        userId: { type: "string" },
        email: { type: "string" },
        session: { type: "string" },
      },
    },
    environmentSchema: {
      properties: {
        userPoolId: { type: "string" },
        userPoolClientId: { type: "string" },
      },
    },
  });

  console.log("OK0");

  const result = await validator.validate(event, main, process.env);

  console.log("result:", JSON.stringify(result, null, 2));
  return result;
};

async function main(request: Request, env: Environment): Promise<Draft<Response>> {
  const identityService = new CognitoIdentityServiceProvider();

  // Check if the user exists.
  const listUsers = await identityService
    .listUsers({
      UserPoolId: env.userPoolId,
      Filter: `email="${request.email}"`,
      Limit: 1,
    })
    .promise();

  // User not exist: sing up.
  if (listUsers.Users && listUsers.Users.length == 0) {
    await identityService
      .signUp({
        ClientId: env.userPoolClientId,
        Username: request.email,
        Password: randomBytes(64).toString("base64"),
        UserAttributes: [
          {
            Name: "email",
            Value: request.email,
          },
        ],
      })
      .promise();
  }

  // User already exists: initiate auth.
  const authResponse = await identityService
    .adminInitiateAuth({
      UserPoolId: env.userPoolId,
      ClientId: env.userPoolClientId,
      AuthFlow: "CUSTOM_AUTH",
      AuthParameters: {
        USERNAME: request.email,
      },
    })
    .promise();

  return {
    userId: authResponse.ChallengeParameters?.["USERNAME"],
    email: authResponse.ChallengeParameters?.["email"],
    session: authResponse.Session,
  };
}
