import * as react from 'react';

interface VisibilityProps {
    ssr?: boolean;
    breakpoint: string;
    hide?: boolean;
    children: React.ReactNode;
}
/**
 * Visibility
 *
 * React component to control the visibility of its
 * children based on the current breakpoint
 */
declare function Visibility(props: VisibilityProps): react.ReactElement<any, string | react.JSXElementConstructor<any>>;

export { Visibility };
