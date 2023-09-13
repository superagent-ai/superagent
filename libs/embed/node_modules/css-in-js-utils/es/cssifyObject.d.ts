export declare type StyleObject = {
    [key: string]: string | number | StyleObject | (string | number | StyleObject)[];
};
export default function cssifyObject(style: StyleObject): string;
