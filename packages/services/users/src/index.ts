import { Function } from "@cloudshape/constructs";
import { Construct } from "constructs";
import * as path from "path";

/**
 * The properties for the UsersService class.
 */
export interface UsersServiceProps {}

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
  constructor(scope: Construct, id: string, props: UsersServiceProps = {}) {
    super(scope, id);

    const createChallengeFunction = new Function(this, "createChallengeFunction", {
      entry: path.join(__dirname, `/functions/create-challenge.ts`),
    });
    const verifyChallengeFunction = new Function(this, "verifyChallengeFunction", {
      entry: path.join(__dirname, `/functions/verify-challenge.ts`),
    });
    const defineChallengeFunction = new Function(this, "defineChallengeFunction", {
      entry: path.join(__dirname, `/functions/define-challenge.ts`),
    });

    const preAuthFunction = new Function(this, "preAuthFunction", {
      entry: path.join(__dirname, `/functions/pre-auth.ts`),
    });
    const postAuthFunction = new Function(this, "postAuthFunction", {
      entry: path.join(__dirname, `/functions/post-auth.ts`),
    });
  }
}
