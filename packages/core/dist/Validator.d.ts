declare type InstanceType = "object" | "array" | "boolean" | "number" | "string";
export interface ValidationError {
    /**
     * Schema keyword.
     */
    keyword: string;
    /**
     * Schema location.
     */
    location: string;
    /**
     * Error message.
     */
    error: string;
}
export interface ValidationResult {
    /**
     * Validation test result.
     */
    valid: boolean;
    /**
     * Any validation test errors.
     */
    errors: ValidationError[];
}
/**
 * @summary Subset of JSON Type Definition.
 *
 * @see https://ajv.js.org/json-type-definition.html
 */
export interface Schema {
    type?: InstanceType;
    properties?: Record<string, Schema>;
}
/**
 * @summary Schema-based data validator.
 */
export declare class Validator {
    private readonly schema;
    constructor(schema: Schema);
    /**
     * Performs the instance validation test based on the provided schema.
     * @param instance the instance to validate.
     * @returns result of validation test.
     */
    test(instance: any): ValidationResult;
    private validate;
    private processInstance;
}
export {};
//# sourceMappingURL=Validator.d.ts.map