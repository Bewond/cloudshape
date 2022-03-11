"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const core_1 = require("@cloudshape/core");
const aws_sdk_1 = require("aws-sdk");
const handler = async (event) => {
    console.log("event:", JSON.stringify(event, null, 2));
    const flow = new core_1.Flow({
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
                tokenType: { type: "string" },
                expiresIn: { type: "number" },
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
    const result = await flow.start(event, main, process.env);
    console.log("result:", JSON.stringify(result, null, 2));
    return result;
};
exports.handler = handler;
async function main(request, env) {
    const identityService = new aws_sdk_1.CognitoIdentityServiceProvider();
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
//# sourceMappingURL=put-users-auth-email.js.map