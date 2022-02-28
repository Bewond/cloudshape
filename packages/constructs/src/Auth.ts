import * as cognito from "aws-cdk-lib/aws-cognito";
import type { Construct } from "constructs";

/**
 * The properties for the Auth construct.
 */
export interface AuthProps {
  /**
   * Whether self sign up should be enabled.
   *
   * @default false
   */
  readonly selfSignUpEnabled?: boolean;

  /**
   * Methods in which a user registers or signs in to a user pool.
   *
   * @default { email: true }
   */
  readonly signInAliases?: cognito.SignInAliases;

  /**
   * The set of attributes that are required for every user in the user pool.
   *
   * @default - Email required, other standard attributes are optional and mutable.
   */
  readonly standardAttributes?: cognito.StandardAttributes;

  /**
   * Lambda functions to use for supported Cognito triggers.
   *
   * @default - No Lambda triggers.
   */
  readonly lambdaTriggers?: cognito.UserPoolTriggers;

  /**
   * Whether sign-in aliases should be evaluated with case sensitivity.
   *
   * @default false
   */
  readonly signInCaseSensitive?: boolean;
}

/**
 * @summary AWS Cognito UserPool construct.
 */
export class Function extends cognito.UserPool {
  constructor(scope: Construct, id: string, props: AuthProps) {
    super(scope, id, {
      ...props,
      selfSignUpEnabled: props.selfSignUpEnabled ?? false,
      signInAliases: props.signInAliases ?? { email: true },
      standardAttributes: props.standardAttributes ?? { email: { required: true, mutable: true } },
      lambdaTriggers: props.lambdaTriggers ?? {},
      signInCaseSensitive: props.signInCaseSensitive ?? false,
    });
  }
}
