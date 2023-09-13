import { ResponsiveValue, SystemProps } from '@chakra-ui/system';

type StackDirection = ResponsiveValue<"row" | "column" | "row-reverse" | "column-reverse">;
interface Options {
    spacing: SystemProps["margin"];
    direction: StackDirection;
}
declare function getDividerStyles(options: Options): {
    "&": any;
};

export { StackDirection, getDividerStyles };
