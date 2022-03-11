type InstanceType = "object" | "array" | "boolean" | "number" | "string";

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
  message: string;
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
export class Validator {
  constructor(private readonly schema: Schema) {}

  /**
   * Performs the instance validation test based on the provided schema.
   * @param instance the instance to validate.
   * @returns result of validation test.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public test(instance: any): ValidationResult {
    return this.validate(instance, this.schema, "#");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private validate(instance: any, schema: Schema, location: string): ValidationResult {
    const instanceType = this.processInstance(instance);
    const { type: $type, properties: $properties } = schema;
    const errors: ValidationError[] = [];

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
          const result = this.validate(
            instance[key],
            $properties[key] ?? {},
            `${location}/properties`
          );
          if (!result.valid) {
            errors.push(
              {
                keyword: "properties",
                location: `${location}/properties`,
                message: `Property "${key}" does not match schema.`,
              },
              ...result.errors
            );
          }
        } else {
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
  private processInstance(instance: any): InstanceType {
    const rawType = typeof instance;

    switch (rawType) {
      case "boolean":
      case "number":
      case "string":
        return rawType;
      case "object":
        if (Array.isArray(instance)) return "array";
        else return "object";
      default:
        // undefined, bigint, function, symbol
        throw new Error(`Instances of "${rawType}" type are not supported.`);
    }
  }
}
