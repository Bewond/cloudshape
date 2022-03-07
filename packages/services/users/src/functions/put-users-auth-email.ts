import { APIValidator } from "@cloudshape/core";
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";

interface Request {
  userId: string;
  session: string;
  secretCode: string;
}

interface Response {
  accessToken: string;
  tokenType: number;
  expiresIn: string;
  idToken: string;
  refreshToken: string;
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
        userId: { type: "string" },
        session: { type: "string" },
        secretCode: { type: "string" },
      },
    },
    responseSchema: {
      properties: {
        accessToken: { type: "string" },
        tokenType: { type: "uint16" },
        expiresIn: { type: "string" },
        idToken: { type: "string" },
        refreshToken: { type: "string" },
      },
    },
    environmentSchema: {
      properties: {
        userPoolId: { type: "string" },
        userPoolClientId: { type: "string" },
      },
    },
  });

  const result = await validator.validate(event, main, process.env);

  console.log("result:", JSON.stringify(result, null, 2));
  return result;
};

async function main(request: Request, env: Environment): Promise<unknown> {
  const identityService = new CognitoIdentityServiceProvider();

  const challengeResponse = await identityService
    .adminRespondToAuthChallenge({
      UserPoolId: env.userPoolId,
      ClientId: env.userPoolClientId,
      ChallengeName: "CUSTOM_CHALLENGE",
      Session: request.session,
      ChallengeResponses: {
        USERNAME: request.userId,
        ANSWER: request.secretCode,
      },
    })
    .promise();

  return {
    accessToken: challengeResponse.AuthenticationResult?.AccessToken,
    tokenType: challengeResponse.AuthenticationResult?.TokenType,
    expiresIn: challengeResponse.AuthenticationResult?.ExpiresIn,
    idToken: challengeResponse.AuthenticationResult?.IdToken,
    refreshToken: challengeResponse.AuthenticationResult?.RefreshToken,
  };
}
