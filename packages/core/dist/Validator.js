"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
/**
 * @summary Schema-based data validator.
 */
class Validator {
    constructor(schema) {
        this.schema = schema;
    }
    /**
     * Performs the instance validation test based on the provided schema.
     * @param instance the instance to validate.
     * @returns result of validation test.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    test(instance) {
        return this.validate(instance, this.schema, "#");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate(instance, schema, location) {
        const instanceType = this.processInstance(instance);
        const { type: $type, properties: $properties } = schema;
        const errors = [];
        // type
        if ($type && $type !== instanceType) {
            errors.push({
                keyword: "type",
                location: `${location}/type`,
                message: `Instance type "${instanceType}" is invalid. Expected "${$type}".`,
            });
        }
        // properties
        if ($properties) {
            for (const key in $properties) {
                if (key in instance) {
                    const result = this.validate(instance[key], $properties[key] ?? {}, `${location}/properties`);
                    if (!result.valid) {
                        errors.push({
                            keyword: "properties",
                            location: `${location}/properties`,
                            message: `Property "${key}" does not match schema.`,
                        }, ...result.errors);
                    }
                }
                else {
                    errors.push({
                        keyword: "properties",
                        location: `${location}/properties`,
                        message: `Instance does not have required property "${key}".`,
                    });
                }
            }
        }
        return {
            valid: errors.length === 0,
            errors: errors,
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    processInstance(instance) {
        const rawType = typeof instance;
        switch (rawType) {
            case "boolean":
            case "number":
            case "string":
                return rawType;
            case "object":
                if (Array.isArray(instance))
                    return "array";
                else
                    return "object";
            default:
                // undefined, bigint, function, symbol
                throw new Error(`Instances of "${rawType}" type are not supported.`);
        }
    }
}
exports.Validator = Validator;
//# sourceMappingURL=Validator.js.map