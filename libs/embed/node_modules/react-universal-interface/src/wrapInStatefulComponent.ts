import * as React from 'react';

const wrapInStatefulComponent = (Comp) => {
    const Decorated = class extends React.Component<any, any> {
        render () {
            return Comp(this.props, this.context);
        }
    };

    if (process.env.NODE_ENV !== 'production') {
        (Decorated as any).displayName = `Decorated(${Comp.displayName || Comp.name})`;
    }

    return Decorated;
};

export default wrapInStatefulComponent;
