import * as react from 'react';
import * as _chakra_ui_react_types from '@chakra-ui/react-types';
import { SystemStyleObject } from '@chakra-ui/system';

declare const PopoverProvider: react.Provider<{
    forceUpdate: () => void;
    isOpen: boolean;
    onAnimationComplete: () => void;
    onClose: () => void;
    getAnchorProps: _chakra_ui_react_types.PropGetter;
    getArrowProps: _chakra_ui_react_types.PropGetter;
    getArrowInnerProps: _chakra_ui_react_types.PropGetter;
    getPopoverPositionerProps: _chakra_ui_react_types.PropGetter;
    getPopoverProps: _chakra_ui_react_types.PropGetter;
    getTriggerProps: _chakra_ui_react_types.PropGetter;
    getHeaderProps: _chakra_ui_react_types.PropGetter;
    getBodyProps: _chakra_ui_react_types.PropGetter;
}>;
declare const usePopoverContext: () => {
    forceUpdate: () => void;
    isOpen: boolean;
    onAnimationComplete: () => void;
    onClose: () => void;
    getAnchorProps: _chakra_ui_react_types.PropGetter;
    getArrowProps: _chakra_ui_react_types.PropGetter;
    getArrowInnerProps: _chakra_ui_react_types.PropGetter;
    getPopoverPositionerProps: _chakra_ui_react_types.PropGetter;
    getPopoverProps: _chakra_ui_react_types.PropGetter;
    getTriggerProps: _chakra_ui_react_types.PropGetter;
    getHeaderProps: _chakra_ui_react_types.PropGetter;
    getBodyProps: _chakra_ui_react_types.PropGetter;
};
declare const PopoverStylesProvider: react.Provider<Record<string, SystemStyleObject>>;
declare const usePopoverStyles: () => Record<string, SystemStyleObject>;

export { PopoverProvider, PopoverStylesProvider, usePopoverContext, usePopoverStyles };
