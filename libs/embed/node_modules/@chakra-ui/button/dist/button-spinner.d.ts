import { HTMLChakraProps } from '@chakra-ui/system';
import { ButtonSpinnerOptions } from './button-types.js';

interface ButtonSpinnerProps extends HTMLChakraProps<"div">, ButtonSpinnerOptions {
}
declare function ButtonSpinner(props: ButtonSpinnerProps): JSX.Element;
declare namespace ButtonSpinner {
    var displayName: string;
}

export { ButtonSpinner };
