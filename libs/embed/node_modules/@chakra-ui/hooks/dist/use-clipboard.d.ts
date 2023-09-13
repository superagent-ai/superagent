import * as react from 'react';

interface UseClipboardOptions {
    /**
     * timeout delay (in ms) to switch back to initial state once copied.
     */
    timeout?: number;
    /**
     * Set the desired MIME type
     */
    format?: string;
}
/**
 * React hook to copy content to clipboard
 *
 * @param value the text or value to copy
 * @param {Number} [optionsOrTimeout=1500] optionsOrTimeout - delay (in ms) to switch back to initial state once copied.
 * @param {Object} optionsOrTimeout
 * @param {string} optionsOrTimeout.format - set the desired MIME type
 * @param {number} optionsOrTimeout.timeout - delay (in ms) to switch back to initial state once copied.
 *
 * @see Docs https://chakra-ui.com/docs/hooks/use-clipboard
 */
declare function useClipboard(value: string, optionsOrTimeout?: number | UseClipboardOptions): {
    value: string;
    setValue: react.Dispatch<react.SetStateAction<string>>;
    onCopy: () => void;
    hasCopied: boolean;
};

export { UseClipboardOptions, useClipboard };
