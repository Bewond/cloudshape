import { CfnOutput } from "aws-cdk-lib";
import type { Construct } from "constructs";
/**
 * The properties for the Output construct.
 */
export interface OutputProps {
    /**
     * The value to output.
     */
    readonly value: string;
    /**
     * Description of the output value.
     *
     * @default - No description.
     */
    readonly description?: string;
}
/**
 * @summary Output a value for future access.
 */
export declare class Output extends CfnOutput {
    constructor(scope: Construct, id: string, props: OutputProps);
}
//# sourceMappingURL=Output.d.ts.map