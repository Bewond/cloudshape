import {
  API,
  Auth,
  CustomDomain,
  Function,
  HttpMethod,
  Output,
  UserPoolClient,
} from "@cloudshape/constructs";
import { Construct } from "constructs";
import * as path from "path";

/**
 * The properties for the UsersService class.
 */
export interface UsersServiceProps {
  /**
   * Email source address.
   */
  readonly emailSource: string;

  /**
   * Subject of the message containing the user secret code.
   *
   * @default "Your secret login code"
   */
  readonly messageSubject?: string;

  /**
   * Text of the message containing the user secret code.
   * You can use the "$secretCode" variable to insert the code.
   *
   * @default "Your secret login code: $secretCode"
   */
  readonly messageText?: string;

  /**
   * HTML of the message containing the user secret code.
   * You can use the "$secretCode" variable to insert the code.
   *
   * @default "<html><body><p>Your secret login code:</p><h3>$secretCode</h3></body></html>"
   */
  readonly messageHtml?: string;

  /**
   * Configure a custom domain.
   *
   * @default - no domain mapping
   */
  readonly customDomain?: CustomDomain;
}

/**
 * @summary The UsersService class.
 */
export class UsersService extends Construct {
  /**
   * @summary Constructs a new instance of the UsersService class.
   * @param {Construct} scope - represents the scope for all the resources.
   * @param {string} id - this is a scope-unique id.
   * @param {UsersServiceProps} props - user provided properties for the construct.
   */
  constructor(scope: Construct, id: string, props: UsersServiceProps) {
    super(scope, id);

    const authUserPool = this.setupUserPool(props);

    const authUserPoolClient = authUserPool.addClient("authUserPoolClient", {
      authFlows: { custom: true },
    });

    const authAPI = this.setupAPI(props, authUserPool, authUserPoolClient);

    new Output(this, "apiEndpoint", {
      value: authAPI.apiEndpoint,
      description: "Auth Service apiEndpoint",
    });
  }

  private setupAPI(props: UsersServiceProps, authPool: Auth, authClient: UserPoolClient): API {
    const authAPI = new API(this, "authAPI", {
      ...(props.customDomain && {
        defaultDomainMapping: {
          domainName: props.customDomain,
          mappingKey: "users",
        },
      }),
    });

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
      method: HttpMethod.POST,
      handler: new Function(this, "postUsersAuthEmail", {
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
      method: HttpMethod.PUT,
      handler: new Function(this, "putUsersAuthEmail", {
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

  private setupUserPool(props: UsersServiceProps): Auth {
    // This function tracks the custom authentication flow, determines which challenges
    // should be presented to the user in which order. At the end, it reports back to the user pool
    // if the user succeeded or failed authentication.
    const defineChallengeFunction = new Function(this, "defineChallengeFunction", {
      entry: path.join(__dirname, `/triggers/define-challenge.js`),
    });

    // This function is invoked to create a unique challenge for the user.
    // Generate a one-time login code and mail it to the user.
    const createChallengeFunction = new Function(this, "createChallengeFunction", {
      entry: path.join(__dirname, `/triggers/create-challenge.js`),
      environment: {
        emailSource: props.emailSource,
        messageSubject: props.messageSubject ?? `Your secret login code`,
        messageText: props.messageText ?? `Your secret login code: $secretCode`,
        messageHtml:
          props.messageHtml ??
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
    const verifyChallengeFunction = new Function(this, "verifyChallengeFunction", {
      entry: path.join(__dirname, `/triggers/verify-challenge.js`),
    });

    // This function auto-confirms users and their email addresses during signup.
    const preSignUpFunction = new Function(this, "preSignUpFunction", {
      entry: path.join(__dirname, `/triggers/pre-sign-up.js`),
    });

    return new Auth(this, "authUserPool", {
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
