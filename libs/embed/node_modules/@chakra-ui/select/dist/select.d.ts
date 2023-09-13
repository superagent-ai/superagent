import * as _chakra_ui_system from '@chakra-ui/system';
import { ThemingProps, PropsOf, HTMLChakraProps } from '@chakra-ui/system';
import { FormControlOptions } from '@chakra-ui/form-control';
import { SelectFieldProps } from './select-field.js';

interface RootProps extends Omit<HTMLChakraProps<"div">, "color"> {
}
interface SelectOptions extends FormControlOptions {
    /**
     * The border color when the select is focused. Use color keys in `theme.colors`
     * @example
     * focusBorderColor = "blue.500"
     */
    focusBorderColor?: string;
    /**
     * The border color when the select is invalid. Use color keys in `theme.colors`
     * @example
     * errorBorderColor = "red.500"
     */
    errorBorderColor?: string;
    /**
     * The placeholder for the select. We render an `<option/>` element that has
     * empty value.
     *
     * ```jsx
     * <option value="">{placeholder}</option>
     * ```
     */
    placeholder?: string;
    /**
     * The size (width and height) of the icon
     */
    iconSize?: string;
    /**
     * The color of the icon
     */
    iconColor?: string;
}
interface SelectProps extends SelectFieldProps, ThemingProps<"Select">, SelectOptions {
    /**
     * Props to forward to the root `div` element
     */
    rootProps?: RootProps;
    /**
     * The icon element to use in the select
     * @type React.ReactElement
     */
    icon?: React.ReactElement<any>;
}
/**
 * React component used to select one item from a list of options.
 *
 * @see Docs https://chakra-ui.com/docs/components/select
 */
declare const Select: _chakra_ui_system.ComponentWithAs<"select", SelectProps>;
declare const DefaultIcon: React.FC<PropsOf<"svg">>;

export { DefaultIcon, Select, SelectProps };
