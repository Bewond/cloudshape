import { APIValidator } from "@cloudshape/core";
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import { randomBytes } from "crypto";

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

  return validator.validate(event, main, process.env);
};

async function main(request: Request, env: Environment): Promise<unknown> {
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
