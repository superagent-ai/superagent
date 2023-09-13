import * as _chakra_ui_system from '@chakra-ui/system';
import { SystemStyleObject, ThemingProps, HTMLChakraProps } from '@chakra-ui/system';

type Chunk = {
    text: string;
    match: boolean;
};
type HighlightOptions = {
    text: string;
    query: string | string[];
};
type UseHighlightProps = HighlightOptions;
declare function useHighlight(props: UseHighlightProps): Chunk[];
type HighlightProps = {
    query: string | string[];
    children: string | ((props: Chunk[]) => React.ReactNode);
    styles?: SystemStyleObject;
};
type MarkProps = ThemingProps<"Mark"> & HTMLChakraProps<"mark">;
declare const Mark: _chakra_ui_system.ComponentWithAs<"mark", MarkProps>;
/**
 * `Highlight` allows you to highlight substrings of a text.
 *
 * @see Docs https://chakra-ui.com/docs/components/highlight
 */
declare function Highlight(props: HighlightProps): JSX.Element;

export { Highlight, HighlightProps, Mark, MarkProps, UseHighlightProps, useHighlight };
