"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const constructs_1 = require("@cloudshape/constructs");
const constructs_2 = require("constructs");
const path = __importStar(require("path"));
/**
 * @summary The UsersService class.
 */
class UsersService extends constructs_2.Construct {
    /**
     * @summary Constructs a new instance of the UsersService class.
     * @param {Construct} scope - represents the scope for all the resources.
     * @param {string} id - this is a scope-unique id.
     * @param {UsersServiceProps} props - user provided properties for the construct.
     */
    constructor(scope, id, props) {
        super(scope, id);
        const authUserPool = this.setupUserPool(props);
        const authUserPoolClient = authUserPool.addClient("authUserPoolClient", {
            authFlows: { custom: true },
        });
        const authAPI = this.setupAPI(authUserPool, authUserPoolClient);
        if (props.customDomain) {
            authAPI.customDomain({
                ...props.customDomain,
                path: "users",
            });
        }
        new constructs_1.Output(this, "apiEndpoint", {
            value: authAPI.apiEndpoint,
            description: "Auth Service apiEndpoint",
        });
    }
    setupAPI(authPool, authClient) {
        const authAPI = new constructs_1.API(this, "authAPI");
        /*const authorizer = authPool.createAuthorizer({
          userPoolClients: [authClient],
        });*/
        const environment = {
            userPoolId: authPool.userPoolId,
            userPoolClientId: authClient.userPoolClientId,
        };
        // User authentication based on email address.
        authAPI.addRoute({
            path: "/auth/email",
            method: constructs_1.HttpMethod.POST,
            handler: new constructs_1.Function(this, "postUsersAuthEmail", {
                entry: path.join(__dirname, `/functions/post-users-auth-email.js`),
                environment: environment,
                permissions: {
                    actions: ["cognito-idp:ListUsers", "cognito-idp:SignUp", "cognito-idp:AdminInitiateAuth"],
                    resources: [authPool.userPoolArn],
                },
            }),
        });
        // Complete user authentication via secret code.
        authAPI.addRoute({
            path: "/auth/email",
            method: constructs_1.HttpMethod.PUT,
            handler: new constructs_1.Function(this, "putUsersAuthEmail", {
                entry: path.join(__dirname, `/functions/put-users-auth-email.js`),
                environment: environment,
                permissions: {
                    actions: ["cognito-idp:AdminRespondToAuthChallenge"],
                    resources: [authPool.userPoolArn],
                },
            }),
        });
        /*// Get authenticated user.
        authAPI.addRoute({
          path: "/users",
          method: HttpMethod.GET,
          authorizer: authorizer,
          handler: new Function(this, "getUsers", {
            entry: path.join(__dirname, `/functions/get-users.js`),
          }),
        });*/
        return authAPI;
    }
    setupUserPool(props) {
        // This function tracks the custom authentication flow, determines which challenges
        // should be presented to the user in which order. At the end, it reports back to the user pool
        // if the user succeeded or failed authentication.
        const defineChallengeFunction = new constructs_1.Function(this, "defineChallengeFunction", {
            entry: path.join(__dirname, `/triggers/define-challenge.js`),
        });
        // This function is invoked to create a unique challenge for the user.
        // Generate a one-time login code and mail it to the user.
        const createChallengeFunction = new constructs_1.Function(this, "createChallengeFunction", {
            entry: path.join(__dirname, `/triggers/create-challenge.js`),
            environment: {
                emailSource: props.emailSource,
                messageSubject: props.messageSubject ?? `Your secret login code`,
                messageText: props.messageText ?? `Your secret login code: $secretCode`,
                messageHtml: props.messageHtml ??
                    `<html><body>
            <p>Your secret login code:</p>
            <h3>$secretCode</h3>
          </body></html>`,
            },
        });
        createChallengeFunction.attachPermissions([
            {
                actions: ["ses:SendEmail", "ses:SendRawEmail"],
                resources: ["*"],
            },
        ]);
        // This function is invoked by the user pool when the user
        // provides the answer to the challenge to determine if that answer is correct.
        const verifyChallengeFunction = new constructs_1.Function(this, "verifyChallengeFunction", {
            entry: path.join(__dirname, `/triggers/verify-challenge.js`),
        });
        // This function auto-confirms users and their email addresses during signup.
        const preSignUpFunction = new constructs_1.Function(this, "preSignUpFunction", {
            entry: path.join(__dirname, `/triggers/pre-sign-up.js`),
        });
        return new constructs_1.Auth(this, "authUserPool", {
            selfSignUpEnabled: true,
            lambdaTriggers: {
                defineAuthChallenge: defineChallengeFunction,
                createAuthChallenge: createChallengeFunction,
                verifyAuthChallengeResponse: verifyChallengeFunction,
                preSignUp: preSignUpFunction,
            },
        });
    }
}
exports.UsersService = UsersService;
//# sourceMappingURL=index.js.map