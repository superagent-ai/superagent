import {createElement as h, cloneElement, version} from 'react';

const isReact16Plus = parseInt(version.substr(0, version.indexOf('.'))) > 15;
const isFn = fn => typeof fn === 'function';

const render = (props, data, ...more) => {
    if (process.env.NODE_ENV !== 'production') {
        if (typeof props !== 'object') {
            throw new TypeError('renderChildren(props, data) first argument must be a props object.');
        }

        const {children, render} = props;

        if (isFn(children) && isFn(render)) {
            console.warn(
                'Both "render" and "children" are specified for in a universal interface component. ' +
                'Children will be used.'
            );
            console.trace();
        }

        if (typeof data !== 'object') {
            console.warn(
                'Universal component interface normally expects data to be an object, ' +
                `"${typeof data}" received.`
            );
            console.trace();
        }
    }

    const {render, children = render, component, comp = component} = props;

    if (isFn(children)) return children(data, ...more);

    if (comp) {
        return h(comp, data);
    }

    if (children instanceof Array)
        return isReact16Plus ? children : h('div', null, ...children);

    if (children && (children instanceof Object)) {
        if (process.env.NODE_ENV !== 'production') {
            if (!children.type || ((typeof children.type !== 'string') && (typeof children.type !== 'function') && (typeof children.type !== 'symbol'))) {
                console.warn(
                    'Universal component interface received object as children, ' +
                    'expected React element, but received unexpected React "type".'
                );
                console.trace();
            }

            if (typeof children.type === 'string')
                return children;

            return cloneElement(children, Object.assign({}, children.props, data));
        } else {
            if (typeof children.type === 'string')
                return children;

            return cloneElement(children, Object.assign({}, children.props, data));
        }
    }

    return children || null;
};

export default render;
