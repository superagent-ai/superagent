export interface NodeIndex {
    node: HTMLElement;
    tabIndex: number;
    index: number;
}
export declare const tabSort: (a: NodeIndex, b: NodeIndex) => number;
export declare const orderByTabIndex: (nodes: HTMLElement[], filterNegative: boolean, keepGuards?: boolean | undefined) => NodeIndex[];
