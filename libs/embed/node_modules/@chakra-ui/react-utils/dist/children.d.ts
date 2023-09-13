import * as react from 'react';

/**
 * Gets only the valid children of a component,
 * and ignores any nullish or falsy child.
 *
 * @param children the children
 */
declare function getValidChildren(children: React.ReactNode): react.ReactElement<any, string | react.JSXElementConstructor<any>>[];

export { getValidChildren };
