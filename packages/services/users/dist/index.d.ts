import { CustomDomain } from "@cloudshape/constructs";
import { Construct } from "constructs";
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
     * @default - no domain mapping configured
     */
    readonly customDomain?: CustomDomain;
}
/**
 * @summary The UsersService class.
 */
export declare class UsersService extends Construct {
    /**
     * @summary Constructs a new instance of the UsersService class.
     * @param {Construct} scope - represents the scope for all the resources.
     * @param {string} id - this is a scope-unique id.
     * @param {UsersServiceProps} props - user provided properties for the construct.
     */
    constructor(scope: Construct, id: string, props: UsersServiceProps);
    private setupAPI;
    private setupUserPool;
}
//# sourceMappingURL=index.d.ts.map