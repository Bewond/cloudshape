"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.APIValidator = void 0;
const aws_sdk_1 = require("aws-sdk");
const crypto_1 = require("crypto");
//
const json_schema_1 = require("@cfworker/json-schema");
/**
 * @summary Validator of an API handler.
 */
class APIValidator {
    constructor(data) {
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
    async validate(event, handler, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    environment) {
        // Validate environment variables.
        if (environment && this.data.environmentSchema) {
            const validateEnvironment = new json_schema_1.Validator(this.data.environmentSchema).validate(environment);
            if (!validateEnvironment.valid) {
                return this.result(500, validateEnvironment.errors);
            }
        }
        // Validate request.
        const request = JSON.parse(event.body ?? "{}");
        const validateRequest = new json_schema_1.Validator(this.data.requestSchema).validate(request);
        if (validateRequest.valid) {
            let response = {};
            // Handle the API request.
            try {
                response = await handler(request, environment ?? {});
            }
            catch (error) {
                return this.result(500, error);
            }
            // Validate response.
            const validateResponse = new json_schema_1.Validator(this.data.responseSchema).validate(response);
            if (validateResponse.valid) {
                return this.result(200, response);
            }
            else {
                return this.result(500, validateResponse.errors);
            }
        }
        else {
            return this.result(400, validateRequest.errors);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result(code, body) {
        return {
            statusCode: code,
            headers: { "content-type": "application/json" },
            body: JSON.stringify(body),
        };
    }
}
exports.APIValidator = APIValidator;
const handler = async (event) => {
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
    const validator = new APIValidator({
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