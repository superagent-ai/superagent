import { Merge, EventKeys } from '@chakra-ui/utils';

declare type MaybeRenderProp<P> = React.ReactNode | ((props: P) => React.ReactNode);
declare type WithoutStyleAttr<T> = Omit<T, "color" | "width" | "height">;
declare type HTMLProps<T = any> = WithoutStyleAttr<React.HTMLAttributes<T>> & React.RefAttributes<T>;
declare type PropGetter<T extends HTMLElement = any, P = {}> = (props?: Merge<HTMLProps<T>, P>, ref?: React.Ref<any> | React.RefObject<any>) => Merge<HTMLProps<T>, P>;
declare type PropGetterV2<T extends React.ElementType, P = {}> = (props?: WithoutStyleAttr<React.ComponentPropsWithoutRef<T>> & P, ref?: React.Ref<any> | React.RefObject<any>) => WithoutStyleAttr<React.ComponentPropsWithRef<T>>;
declare type EventKeyMap = Partial<Record<EventKeys, React.KeyboardEventHandler>>;

export { EventKeyMap, HTMLProps, MaybeRenderProp, PropGetter, PropGetterV2 };
