import { ShowProps } from './show.js';

type HideProps = ShowProps;
/**
 * `Hide` wraps a component to not render if the provided media query matches.
 *
 * @see Docs https://chakra-ui.com/docs/components/show-hide
 */
declare function Hide(props: HideProps): JSX.Element;
declare namespace Hide {
    var displayName: string;
}

export { Hide, HideProps };
