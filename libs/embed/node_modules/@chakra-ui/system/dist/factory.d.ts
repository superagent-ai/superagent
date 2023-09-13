import { HTMLChakraComponents, ChakraStyledOptions } from './system.js';
import { As, ChakraComponent } from './system.types.js';
import '@chakra-ui/styled-system';
import '@chakra-ui/utils';
import '@emotion/styled';
import './system.utils.js';
import '@emotion/react';

type ChakraFactory = {
    <T extends As, P extends object = {}>(component: T, options?: ChakraStyledOptions): ChakraComponent<T, P>;
};
/**
 * The Chakra factory serves as an object of chakra enabled JSX elements,
 * and also a function that can be used to enable custom component receive chakra's style props.
 *
 * @see Docs https://chakra-ui.com/docs/styled-system/chakra-factory
 */
declare const chakra: ChakraFactory & HTMLChakraComponents;

export { chakra };
