import * as react from 'react';
import { SystemStyleObject } from '@chakra-ui/system';
import { UseEditableReturn } from './use-editable.js';
import '@chakra-ui/react-types';

declare const EditableStylesProvider: react.Provider<Record<string, SystemStyleObject>>;
declare const useEditableStyles: () => Record<string, SystemStyleObject>;
type EditableContext = Omit<UseEditableReturn, "htmlProps">;
declare const EditableProvider: react.Provider<EditableContext>;
declare const useEditableContext: () => EditableContext;

export { EditableContext, EditableProvider, EditableStylesProvider, useEditableContext, useEditableStyles };
