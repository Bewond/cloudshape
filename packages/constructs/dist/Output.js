"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Output = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
/**
 * @summary Output a value for future access.
 */
class Output extends aws_cdk_lib_1.CfnOutput {
    constructor(scope, id, props) {
        super(scope, id, {
            ...props,
            value: props.value,
            description: props.description ?? "",
        });
    }
}
exports.Output = Output;
