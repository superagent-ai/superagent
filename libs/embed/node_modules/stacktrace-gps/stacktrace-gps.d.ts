import { SourceMapConsumer } from "source-map";
import StackFrame = require("stackframe");

declare namespace StackTraceGPS {
  /**
   * Options for the StackTraceGPS constructor
   */
  interface Options {
    /** Pre-populate source cache to avoid network requests */
    sourceCache?: { [url: string]: string | Promise<string> };

    /** Pre-populate SourceMapConsumer cache to avoid network requests */
    sourceMapConsumerCache?: { [sourceMappingUrl: string]: SourceMapConsumer };

    /** True to prevent network requests (best effort without sources or source maps) */
    offline?: boolean;

    /** Function to be used for making X-Domain requests */
    ajax?(url: string): Promise<string>;

    /** Function to convert base64-encoded strings to their original representation */
    atob?(base64: string): string;
  }
}

declare class StackTraceGPS {
  /**
   * @param opts - StackTraceGPS.Options object
   */
  constructor(opts?: StackTraceGPS.Options);

  /**
   * Given a StackFrame, enhance function name and use source maps for
   * a better StackFrame.
   *
   * @param stackframe - StackFrame object
   * @returns Promise that resolves with with source-mapped StackFrame
   */
  pinpoint(stackframe: StackFrame): Promise<StackFrame>;

  /**
   * Given a StackFrame, guess function name from location
   * information.
   *
   * @param stackframe - StackFrame object
   * @returns Promise that resolves with enhanced StackFrame
   */
  findFunctionName(stackframe: StackFrame): Promise<StackFrame>;

  /**
   * Given a StackFrame, seek source-mapped location and return new
   * enhanced StackFrame.
   *
   * @param stackframe - StackFrame object
   * @returns Promise that resolves with enhanced StackFrame
   */
  getMappedLocation(stackframe: StackFrame): Promise<StackFrame>;
}

export = StackTraceGPS;

export as namespace StackTraceGPS; // global for non-module UMD users
