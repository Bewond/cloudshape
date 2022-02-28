import { Construct } from "constructs";
import { Function } from "@cloudshape/constructs";
import * as path from "path";

/**
 * The properties for the UsersService class.
 */
export interface UsersServiceProps { }

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

    const preSignUpFn = new Function(this, "preSignUp", {
      entry: path.join(__dirname, `/functions/pre-sign-up.ts`),
    });
  }
}
