import { SchemaType, validateEventResult } from "@cloudshape/core";
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import { randomBytes } from "crypto";
import { env } from "process";

interface Request {
  email: string;
}

interface Response {
  userId: string;
  email: string;
  session: string;
}

const requestSchema: SchemaType<Request> = {
  properties: {
    email: { type: "string" },
  },
};

const responseSchema: SchemaType<Response> = {
  properties: {
    userId: { type: "string" },
    email: { type: "string" },
    session: { type: "string" },
  },
};

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  console.log("Event:", JSON.stringify(event, null, 2));

  return validateEventResult(event, requestSchema, responseSchema, main);
};

async function main(request: Request): Promise<any> {
  const identityService = new CognitoIdentityServiceProvider();

  // Check if the user exists.
  const listUsers = await identityService
    .listUsers({
      UserPoolId: env["userPoolId"]!,
      Filter: `email="${request.email}"`,
      Limit: 1,
    })
    .promise();

  // User not exist: sing up.
  if (listUsers.Users && listUsers.Users.length == 0) {
    await identityService
      .signUp({
        ClientId: env["userPoolClientId"]!,
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
      UserPoolId: env["userPoolId"]!,
      ClientId: env["userPoolClientId"]!,
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
