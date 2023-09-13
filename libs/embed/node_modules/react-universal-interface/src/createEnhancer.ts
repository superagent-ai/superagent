import * as React from 'react';
import addClassDecoratorSupport from './addClassDecoratorSupport';

const h = React.createElement;

const noWrap = (Comp, propName, props, state) => h(Comp, propName ?
  {[propName]: state, ...props} :
  {...state, ...props}
);

export const divWrapper = (Comp, propName, props, state) =>
  h('div', null, noWrap(Comp, propName, props, state)) as any;

const createEnhancer = (Facc, prop?: string, wrapper = noWrap) => {
    const enhancer = (Comp, propName: any = prop, faccProps: object = null) => {
        const isClassDecoratorMethodCall = typeof Comp === 'string';

        if (isClassDecoratorMethodCall) {
            return (Klass) => enhancer(Klass, Comp as any || prop, propName as any);
        }

        const Enhanced = (props) =>
            h(Facc, faccProps, (state) => wrapper(Comp, propName, props, state));

        if (process.env.NODE_ENV !== 'production') {
            (Enhanced as any).displayName = `${Facc.displayName || Facc.name}(${Comp.displayName || Comp.name})`;
        }

        return isClassDecoratorMethodCall ? addClassDecoratorSupport(Enhanced) : Enhanced;
    };

    return enhancer;
}

export default createEnhancer;
