import * as iam from "aws-cdk-lib/aws-iam";
import type { Construct } from "constructs";

export type Constructor<T = {}> = new (...args: any[]) => T;

export interface Permission {
  readonly actions: string[];

  readonly resources: string[];
}

export function PermissionsMixin<T extends Constructor>(Base: T) {
  return class extends Base {
    private constructRole?: iam.Role;
    private policyScope?: Construct;
    private policyId?: string;

    public initializeMixin(
      constructRole: iam.Role | iam.IRole,
      policyScope: Construct,
      policyId: string
    ): void {
      this.constructRole = constructRole as iam.Role;
      this.policyScope = policyScope;
      this.policyId = policyId;
    }

    public attachPermissions(permissions: Permission[]): void {
      const statements: iam.PolicyStatement[] = [];

      for (let permission of permissions) {
        statements.push(
          new iam.PolicyStatement({
            actions: permission.actions,
            resources: permission.resources,
          })
        );
      }

      if (this.constructRole) {
        this.constructRole.attachInlinePolicy(
          new iam.Policy(this.policyScope!, this.policyId!, {
            statements: statements,
          })
        );
      }
    }
  };
}
