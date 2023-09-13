import * as _chakra_ui_react_types from '@chakra-ui/react-types';

/**
 * React hook use to create controls for the editable component
 */
declare function useEditableControls(): {
    isEditing: boolean;
    getEditButtonProps: _chakra_ui_react_types.PropGetter;
    getCancelButtonProps: _chakra_ui_react_types.PropGetter;
    getSubmitButtonProps: _chakra_ui_react_types.PropGetter;
};

export { useEditableControls };
