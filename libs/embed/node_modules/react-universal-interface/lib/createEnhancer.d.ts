import * as React from 'react';
export declare const divWrapper: (Comp: any, propName: any, props: any, state: any) => any;
declare const createEnhancer: (Facc: any, prop?: string, wrapper?: (Comp: any, propName: any, props: any, state: any) => React.CElement<any, React.Component<any, any, any>>) => (Comp: any, propName?: any, faccProps?: object) => any;
export default createEnhancer;
