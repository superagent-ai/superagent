import render from './render';
import createEnhancer from './createEnhancer';
import hookToRenderProp from './hookToRenderProp';

export interface UniversalProps<Data> {
    children?: ((data: Data) => React.ReactNode) | React.ReactNode;
    render?: (data: Data) => React.ReactNode;
    comp?: React.ComponentType<Data & any>;
    component?: React.ComponentType<Data & any>;
}

export {
    render,
    createEnhancer,
    hookToRenderProp,
};
