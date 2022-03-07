"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const core_1 = require("@cloudshape/core");
const aws_sdk_1 = require("aws-sdk");
const crypto_1 = require("crypto");
const handler = async (event) => {
    console.log("event:", JSON.stringify(event, null, 2));
    const validator = new core_1.APIValidator({
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
    const result = await validator.validate(event, main, process.env);
    console.log("result:", JSON.stringify(result, null, 2));
    return result;
};
exports.handler = handler;
async function main(request, env) {
    const identityService = new aws_sdk_1.CognitoIdentityServiceProvider();
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
            Password: (0, crypto_1.randomBytes)(64).toString("base64"),
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
//# sourceMappingURL=post-users-auth-email.js.map