declare type StyleObject = {
    [key: string]: string | number | StyleObject | (string | number | StyleObject)[];
};
export default function assignStyle(base: StyleObject, ...extendingStyles: StyleObject[]): StyleObject;
export {};
