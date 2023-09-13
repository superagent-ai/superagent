import { As, RightJoinProps, PropsOf, ComponentWithAs } from './system.types.js';
import '@chakra-ui/styled-system';
import '@emotion/react';

declare function forwardRef<Props extends object, Component extends As>(component: React.ForwardRefRenderFunction<any, RightJoinProps<PropsOf<Component>, Props> & {
    as?: As;
}>): ComponentWithAs<Component, Props>;

export { forwardRef };
