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
exports.PermissionsMixin = void 0;
const iam = __importStar(require("aws-cdk-lib/aws-iam"));
function PermissionsMixin(Base) {
    return class extends Base {
        /**
         * @summary Initialize PermissionsMixin data.
         *
         * @param constructRole - the IAM Role to attach Policy.
         * @param policyScope - scope for Policy resource.
         * @param policyId - scope-unique id for Policy resource.
         */
        initializeMixin(constructRole, policyScope, policyId) {
            this.constructRole = constructRole;
            this.policyScope = policyScope;
            this.policyId = policyId;
        }
        /**
         * Grant permissions for actions on resources. By default, access to resources are denied.
         */
        attachPermissions(permissions) {
            const statements = [];
            // Add Policy statements.
            for (const permission of permissions) {
                statements.push(new iam.PolicyStatement({
                    actions: permission.actions,
                    resources: permission.resources,
                }));
            }
            // Attach Policy.
            if (this.constructRole && this.policyScope && this.policyId) {
                this.constructRole.attachInlinePolicy(new iam.Policy(this.policyScope, this.policyId, {
                    statements: statements,
                }));
            }
        }
    };
}
exports.PermissionsMixin = PermissionsMixin;
