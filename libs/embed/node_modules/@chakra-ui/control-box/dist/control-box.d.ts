import { SystemStyleObject, HTMLChakraProps } from '@chakra-ui/system';

interface ControlBoxOptions {
    type?: "checkbox" | "radio";
    _hover?: SystemStyleObject;
    _invalid?: SystemStyleObject;
    _disabled?: SystemStyleObject;
    _focus?: SystemStyleObject;
    _checked?: SystemStyleObject;
    _child?: SystemStyleObject;
    _checkedAndChild?: SystemStyleObject;
    _checkedAndDisabled?: SystemStyleObject;
    _checkedAndFocus?: SystemStyleObject;
    _checkedAndHover?: SystemStyleObject;
}
type IControlBox = ControlBoxOptions;
interface BaseControlProps extends Omit<HTMLChakraProps<"div">, keyof ControlBoxOptions> {
}
interface ControlBoxProps extends BaseControlProps, ControlBoxOptions {
}
/**
 * @deprecated This component will be removed in the next major release.
 */
declare const ControlBox: React.FC<ControlBoxProps>;

export { ControlBox, ControlBoxOptions, ControlBoxProps, IControlBox, ControlBox as default };
