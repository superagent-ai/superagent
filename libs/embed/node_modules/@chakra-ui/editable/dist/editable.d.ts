import * as _chakra_ui_system from '@chakra-ui/system';
import { ThemingProps, HTMLChakraProps } from '@chakra-ui/system';
import { UseEditableProps, UseEditableReturn } from './use-editable.js';
import '@chakra-ui/react-types';
import 'react';

type RenderProps = Pick<UseEditableReturn, "isEditing" | "onSubmit" | "onCancel" | "onEdit">;
type MaybeRenderProp<P> = React.ReactNode | ((props: P) => React.ReactNode);
interface BaseEditableProps extends Omit<HTMLChakraProps<"div">, "onChange" | "value" | "defaultValue" | "onSubmit" | "onBlur"> {
}
interface EditableProps extends UseEditableProps, Omit<BaseEditableProps, "children">, ThemingProps<"Editable"> {
    children?: MaybeRenderProp<RenderProps>;
}
/**
 * Editable
 *
 * The wrapper that provides context and logic for all editable
 * components. It renders a `div`
 *
 * @see Docs https://chakra-ui.com/docs/components/editable
 */
declare const Editable: _chakra_ui_system.ComponentWithAs<"div", EditableProps>;

export { Editable, EditableProps };
