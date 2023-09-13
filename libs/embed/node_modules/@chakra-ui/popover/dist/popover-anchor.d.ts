import * as _chakra_ui_react_types from '@chakra-ui/react-types';
import * as react from 'react';

/**
 * PopoverAnchor is element that is used as the positioning reference
 * for the popover.
 */
declare function PopoverAnchor(props: React.PropsWithChildren<{}>): react.DetailedReactHTMLElement<react.AriaAttributes & react.DOMAttributes<_chakra_ui_react_types.DOMElement> & _chakra_ui_react_types.DataAttributes & {
    id?: string | undefined;
    role?: react.AriaRole | undefined;
    tabIndex?: number | undefined;
    style?: react.CSSProperties | undefined;
} & react.RefAttributes<any>, HTMLElement>;
declare namespace PopoverAnchor {
    var displayName: string;
}

export { PopoverAnchor };
