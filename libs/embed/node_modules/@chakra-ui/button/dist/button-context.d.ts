import * as react from 'react';
import { ThemingProps } from '@chakra-ui/system';

interface ButtonGroupContext extends ThemingProps<"Button"> {
    /**
     * @default false
     */
    isDisabled?: boolean;
}
declare const ButtonGroupProvider: react.Provider<ButtonGroupContext>;
declare const useButtonGroup: () => ButtonGroupContext;

export { ButtonGroupContext, ButtonGroupProvider, useButtonGroup };
