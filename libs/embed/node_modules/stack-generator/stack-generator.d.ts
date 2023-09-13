// Type definitions for StackGenerator v2.0
// Project: https://github.com/stacktracejs/stack-generator
// Definitions by: Eric Wendelin <https://www.eriwen.com>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import StackFrame = require("stackframe");

declare namespace StackGenerator {
    export type {StackFrame};

    interface StackGeneratorOptions {
        /** Maximum number of StackFrames to return. Default is 10 */
        maxStackSize: number
    }

    /**
     * Generate artificial backtrace by walking arguments.callee.caller chain.
     *
     * @param {Object} opts object
     * @return {Array} of StackFrames
     */
    export function backtrace(opts: StackGeneratorOptions): StackFrame[];
}

export = StackGenerator;
