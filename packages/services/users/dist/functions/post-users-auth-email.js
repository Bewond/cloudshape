"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.APIValidator = void 0;
const aws_sdk_1 = require("aws-sdk");
const crypto_1 = require("crypto");
//
const jtd_1 = __importDefault(require("ajv/dist/jtd"));
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
        const ajv = new jtd_1.default();
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
            }
            catch (error) {
                return this.result(500, error);
            }
            console.log("OK4");
            // Validate response.
            const validateResponse = ajv.compile(this.data.responseSchema);
            if (validateResponse(response)) {
                console.log("OK5");
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
        console.log("WOW");
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