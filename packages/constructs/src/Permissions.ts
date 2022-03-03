import * as iam from "aws-cdk-lib/aws-iam";
import type { Construct } from "constructs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = any> = new (...args: any[]) => T;

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

export function PermissionsMixin<T extends Constructor>(Base: T) {
  return class extends Base {
    public constructRole?: iam.Role;
    public policyScope?: Construct;
    public policyId?: string;

    /**
     * @summary Initialize PermissionsMixin data.
     *
     * @param constructRole - the IAM Role to attach Policy.
     * @param policyScope - scope for Policy resource.
     * @param policyId - scope-unique id for Policy resource.
     */
    public initializeMixin(
      constructRole: iam.Role | iam.IRole,
      policyScope: Construct,
      policyId: string
    ): void {
      this.constructRole = constructRole as iam.Role;
      this.policyScope = policyScope;
      this.policyId = policyId;
    }

    /**
     * Grant permissions for actions on resources. By default, access to resources are denied.
     */
    public attachPermissions(permissions: Permission[]): void {
      const statements: iam.PolicyStatement[] = [];

      // Add Policy statements.
      for (const permission of permissions) {
        statements.push(
          new iam.PolicyStatement({
            actions: permission.actions,
            resources: permission.resources,
          })
        );
      }

      // Attach Policy.
      if (this.constructRole && this.policyScope && this.policyId) {
        this.constructRole.attachInlinePolicy(
          new iam.Policy(this.policyScope, this.policyId, {
            statements: statements,
          })
        );
      }
    }
  };
}
