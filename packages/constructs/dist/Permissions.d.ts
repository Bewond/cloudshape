import * as iam from "aws-cdk-lib/aws-iam";
import type { Construct } from "constructs";
declare type Constructor<T = any> = new (...args: any[]) => T;
/**
 * Represents a permission statement.
 */
export interface Permission {
    /**
     * List of actions to add to the permission statement.
     */
    readonly actions: string[];
    /**
     * Resource ARNs to add to the permission statement.
     */
    readonly resources: string[];
}
export declare function PermissionsMixin<T extends Constructor>(Base: T): {
    new (...args: any[]): {
        [x: string]: any;
        constructRole?: iam.Role;
        policyScope?: Construct;
        policyId?: string;
        /**
         * @summary Initialize PermissionsMixin data.
         *
         * @param constructRole - the IAM Role to attach Policy.
         * @param policyScope - scope for Policy resource.
         * @param policyId - scope-unique id for Policy resource.
         */
        initializeMixin(constructRole: iam.Role | iam.IRole, policyScope: Construct, policyId: string): void;
        /**
         * Grant permissions for actions on resources. By default, access to resources are denied.
         */
        attachPermissions(permissions: Permission[]): void;
    };
} & T;
export {};
//# sourceMappingURL=Permissions.d.ts.map