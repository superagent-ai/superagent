import * as _chakra_ui_react_types from '@chakra-ui/react-types';
import * as react from 'react';

/**
 * PopoverTrigger opens the popover's content. It must be an interactive element
 * such as `button` or `a`.
 */
declare function PopoverTrigger(props: {
    children: React.ReactNode;
}): react.DetailedReactHTMLElement<react.AriaAttributes & react.DOMAttributes<_chakra_ui_react_types.DOMElement> & _chakra_ui_react_types.DataAttributes & {
    id?: string | undefined;
    role?: react.AriaRole | undefined;
    tabIndex?: number | undefined;
    style?: react.CSSProperties | undefined;
} & react.RefAttributes<any>, HTMLElement>;
declare namespace PopoverTrigger {
    var displayName: string;
}

export { PopoverTrigger };
