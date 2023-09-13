import * as CSS from 'csstype';
import { AnalyzeBreakpointsReturn } from '@chakra-ui/breakpoint-utils';
import { BaseThemeTypings } from './shared.types.js';
export { BaseThemeTypings } from './shared.types.js';
import { ThemeTypings as ThemeTypings$1 } from './theming.types.js';

type Operand = string | number | {
    reference: string;
};
interface CalcChain {
    add: (...operands: Array<Operand>) => CalcChain;
    subtract: (...operands: Array<Operand>) => CalcChain;
    multiply: (...operands: Array<Operand>) => CalcChain;
    divide: (...operands: Array<Operand>) => CalcChain;
    negate: () => CalcChain;
    toString: () => string;
}
declare const calc: ((x: Operand) => CalcChain) & {
    add: (...operands: Array<Operand>) => string;
    subtract: (...operands: Array<Operand>) => string;
    multiply: (...operands: Array<Operand>) => string;
    divide: (...operands: Array<Operand>) => string;
    negate: (x: Operand) => string;
};

declare function addPrefix(value: string, prefix?: string): string;
declare function toVarReference(name: string, fallback?: string): string;
declare function toVarDefinition(value: string, prefix?: string): string;
declare function cssVar(name: string, fallback?: string, cssVarPrefix?: string): {
    variable: string;
    reference: string;
};
type VarDefinition = ReturnType<typeof cssVar>;
declare function defineCssVars<K extends string>(scope: string, keys: Array<K | [K, string]>): Record<K, VarDefinition>;

/**
 * This is a placeholder meant to be implemented via TypeScript's Module
 * Augmentation feature and is an alternative to running `npx @chakra-ui/cli
 * tokens`
 *
 * @example
 * ```ts
 * import { BaseThemeTypings } from "@chakra-ui/styled-system";
 *
 * type DefaultSizes = 'small' | 'medium' | 'large';
 *
 * declare module "@chakra-ui/styled-system" {
 *   export interface CustomThemeTypings extends BaseThemeTypings {
 *     // Example custom `borders` tokens
 *     borders: 'none' | 'thin' | 'thick';
 *     // ...
 *     // Other custom tokens
 *     // ...
 *     components: {
 *       Button: {
 *         // Example custom component sizes and variants
 *         sizes: DefaultSizes;
 *         variants: 'solid' | 'outline' | 'wacky' | 'chill';
 *       },
 *       // ...
 *      }
 *   }
 * }
 * ```
 *
 * @see https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
 */
interface CustomThemeTypings {
}
type ThemeTypings = CustomThemeTypings extends BaseThemeTypings ? CustomThemeTypings : ThemeTypings$1;

type ResponsiveArray<T> = Array<T | null>;
type ResponsiveObject<T> = Partial<Record<ThemeTypings["breakpoints"] | string, T>>;
type ResponsiveValue<T> = T | ResponsiveArray<T> | ResponsiveObject<T>;
type Length = string | 0 | number;
type Union<T> = T | (string & {});
type Token<CSSType, ThemeKey = unknown> = ThemeKey extends keyof ThemeTypings ? ResponsiveValue<CSSType | ThemeTypings[ThemeKey]> : ResponsiveValue<CSSType>;
type CSSMap = Record<string, {
    value: string;
    var: string;
    varRef: string;
}>;
type Transform = (value: any, theme: CssTheme, styles?: Record<string, any>) => any;
type WithCSSVar<T> = T & {
    __cssVars: Record<string, any>;
    __cssMap: CSSMap;
    __breakpoints: AnalyzeBreakpointsReturn;
};
type CssTheme = WithCSSVar<{
    breakpoints: Record<string, any>;
    direction?: "ltr" | "rtl";
    [key: string]: any;
}>;

declare function toCSSVar<T extends Record<string, any>>(rawTheme: T): WithCSSVar<T>;

type SemanticValue<Conditions extends string, Token extends string = string> = Union<Token> | Partial<Record<"default" | Conditions, Union<Token>>>;
type PlainToken = {
    isSemantic: false;
    value: string | number;
};
type SemanticToken = {
    isSemantic: true;
    value: string | number | SemanticValue<string>;
};
type FlatToken = PlainToken | SemanticToken;
type FlatTokens = Record<string, FlatToken>;
type FlattenTokensParam = {
    tokens?: object;
    semanticTokens?: object;
};
declare function flattenTokens<T extends FlattenTokensParam>({ tokens, semanticTokens, }: T): FlatTokens;

declare const tokens: readonly ["colors", "borders", "borderWidths", "borderStyles", "fonts", "fontSizes", "fontWeights", "gradients", "letterSpacings", "lineHeights", "radii", "space", "shadows", "sizes", "zIndices", "transition", "blur", "breakpoints"];
type ThemeScale = typeof tokens[number] | "transition.duration" | "transition.property" | "transition.easing";

type CSSProp = keyof CSS.Properties | (string & {});
type MaybeArray<T> = T | T[];
type MaybeThemeFunction<T> = T | ((theme: CssTheme) => T);
type StringUnion<T> = T | (string & {});
interface PropConfig {
    /**
     * This is useful for props that need to leverage CSS variables
     * Static styles to append to the computed styles.
     *
     * It does not get replicated if value is responsive or styles are nested.
     */
    static?: Record<string, any>;
    /**
     * The theme scale this maps to
     */
    scale?: ThemeScale;
    /**
     * Css property or Css variable the prop maps to
     */
    property?: MaybeThemeFunction<MaybeArray<StringUnion<CSSProp>>>;
    /**
     * Function to transform the value passed
     */
    transform?: Transform;
    /**
     * Useful for `layerStyle`, tex`tStyles and `apply` where their
     * transform function returns theme aware styles
     */
    processResult?: boolean;
}
type Config$1 = Record<string, PropConfig | true>;

declare const background: Config$1;
interface BackgroundProps {
    /**
     * The CSS `background` property
     */
    bg?: Token<CSS.Property.Color, "colors">;
    /**
     * The CSS `background-clip` property
     */
    bgClip?: Token<CSS.Property.BackgroundClip | "text">;
    /**
     * The CSS `background-clip` property
     */
    backgroundClip?: Token<CSS.Property.BackgroundClip | "text">;
    /**
     * The CSS `background` property
     */
    background?: Token<CSS.Property.Color, "colors">;
    /**
     * The CSS `background-color` property
     */
    bgColor?: Token<CSS.Property.Color, "colors">;
    /**
     * The CSS `background-color` property
     */
    backgroundColor?: Token<CSS.Property.Color, "colors">;
    /**
     * The CSS `background-image` property
     */
    backgroundImage?: Token<CSS.Property.BackgroundImage, "gradients">;
    /**
     * The background-gradient shorthand
     */
    bgGradient?: Token<CSS.Property.BackgroundImage, "gradients">;
    /**
     * The CSS `background-size` property
     */
    backgroundSize?: Token<CSS.Property.BackgroundSize | number>;
    /**
     * The CSS `background-position` property
     */
    bgPos?: Token<CSS.Property.BackgroundPosition | number>;
    /**
     * The CSS `background-position` property
     */
    backgroundPosition?: Token<CSS.Property.BackgroundPosition | number>;
    /**
     * The CSS `background-image` property
     */
    bgImage?: Token<CSS.Property.BackgroundImage, "gradients">;
    /**
     * The CSS `background-image` property
     */
    bgImg?: Token<CSS.Property.BackgroundImage, "gradients">;
    /**
     * The CSS `background-repeat` property
     */
    bgRepeat?: Token<CSS.Property.BackgroundRepeat>;
    /**
     * The CSS `background-repeat` property
     */
    backgroundRepeat?: Token<CSS.Property.BackgroundRepeat>;
    /**
     * The CSS `background-size` property
     */
    bgSize?: Token<CSS.Property.BackgroundSize | number>;
    /**
     * The CSS `background-attachment` property
     */
    bgAttachment?: Token<CSS.Property.BackgroundAttachment>;
    /**
     * The CSS `background-attachment` property
     */
    backgroundAttachment?: Token<CSS.Property.BackgroundAttachment>;
    /**
     * The CSS `background-position` property
     */
    bgPosition?: Token<CSS.Property.BackgroundPosition | number>;
}

declare const border: Config$1;
/**
 * The prop types for border properties listed above
 */
interface BorderProps {
    /**
     * The CSS `border` property
     */
    border?: Token<CSS.Property.Border | number, "borders">;
    /**
     * The CSS `border-width` property
     */
    borderWidth?: Token<CSS.Property.BorderWidth | number>;
    /**
     * The CSS `border-style` property
     */
    borderStyle?: Token<CSS.Property.BorderStyle>;
    /**
     * The CSS `border-color` property
     */
    borderColor?: Token<CSS.Property.BorderTopColor, "colors">;
    /**
     * The CSS `border-radius` property
     */
    borderRadius?: Token<CSS.Property.BorderRadius | number, "radii">;
    /**
     * The CSS `border-radius` property
     */
    rounded?: Token<CSS.Property.BorderRadius | number, "radii">;
    /**
     * The CSS `border-top` property
     */
    borderTop?: Token<CSS.Property.BorderTop | number, "borders">;
    borderBlockStart?: Token<CSS.Property.BorderBlockStart | number>;
    /**
     * The CSS `border-top-width` property
     */
    borderTopWidth?: Token<CSS.Property.BorderWidth | number>;
    borderBlockStartWidth?: Token<CSS.Property.BorderBlockStartWidth | number>;
    /**
     * The CSS `border-bottom-width` property
     */
    borderBottomWidth?: Token<CSS.Property.BorderWidth | number>;
    borderBlockEndWidth?: Token<CSS.Property.BorderBlockEndWidth | number>;
    /**
     * The CSS `border-left-width` property
     */
    borderLeftWidth?: Token<CSS.Property.BorderWidth | number>;
    borderStartWidth?: Token<CSS.Property.BorderWidth | number>;
    borderInlineStartWidth?: Token<CSS.Property.BorderInlineStartWidth | number>;
    /**
     * The CSS `border-right-width` property
     */
    borderRightWidth?: Token<CSS.Property.BorderWidth | number>;
    borderEndWidth?: Token<CSS.Property.BorderWidth | number>;
    borderInlineEndWidth?: Token<CSS.Property.BorderInlineEndWidth | number>;
    /**
     * The CSS `border-top-style` property
     */
    borderTopStyle?: Token<CSS.Property.BorderTopStyle>;
    borderBlockStartStyle?: Token<CSS.Property.BorderBlockStartStyle>;
    /**
     * The CSS `border-bottom-style` property
     */
    borderBottomStyle?: Token<CSS.Property.BorderBottomStyle>;
    borderBlockEndStyle?: Token<CSS.Property.BorderBlockEndStyle>;
    /**
     * The CSS `border-left-style` property
     */
    borderLeftStyle?: Token<CSS.Property.BorderLeftStyle>;
    borderStartStyle?: Token<CSS.Property.BorderInlineStartStyle>;
    borderInlineStartStyle?: Token<CSS.Property.BorderInlineStartStyle>;
    /**
     * The CSS `border-right-styles` property
     */
    borderRightStyle?: Token<CSS.Property.BorderRightStyle>;
    borderEndStyle?: Token<CSS.Property.BorderInlineEndStyle>;
    borderInlineEndStyle?: Token<CSS.Property.BorderInlineEndStyle>;
    /**
     * The CSS `border-top-color` property
     */
    borderTopColor?: Token<CSS.Property.BorderTopColor, "colors">;
    borderBlockStartColor?: Token<CSS.Property.BorderBlockStartColor, "colors">;
    /**
     * The CSS `border-bottom-color` property
     */
    borderBottomColor?: Token<CSS.Property.BorderBottomColor, "colors">;
    borderBlockEndColor?: Token<CSS.Property.BorderBlockEndColor, "colors">;
    /**
     * The CSS `border-left-color` property
     */
    borderLeftColor?: Token<CSS.Property.BorderLeftColor, "colors">;
    borderStartColor?: Token<CSS.Property.BorderInlineStartColor>;
    borderInlineStartColor?: Token<CSS.Property.BorderInlineStartColor, "colors">;
    /**
     * The CSS `border-right-color` property
     */
    borderRightColor?: Token<CSS.Property.BorderRightColor, "colors">;
    borderEndColor?: Token<CSS.Property.BorderInlineEndColor>;
    borderInlineEndColor?: Token<CSS.Property.BorderInlineEndColor, "colors">;
    /**
     * The CSS `border-right` property
     */
    borderRight?: Token<CSS.Property.BorderRight | number, "borders">;
    borderEnd?: Token<CSS.Property.BorderInlineStart | number>;
    borderInlineEnd?: Token<CSS.Property.BorderInlineEnd | number>;
    /**
     * The CSS `border-bottom` property
     */
    borderBottom?: Token<CSS.Property.BorderBottom | number, "borders">;
    borderBlockEnd?: Token<CSS.Property.BorderBlockEnd | number>;
    /**
     * The CSS `border-left` property
     */
    borderLeft?: Token<CSS.Property.BorderLeft | number, "borders">;
    borderStart?: Token<CSS.Property.BorderInlineStart | number>;
    borderInlineStart?: Token<CSS.Property.BorderInlineStart | number>;
    /**
     * The CSS `border-top-radius` property
     */
    borderTopRadius?: Token<CSS.Property.BorderRadius | number, "radii">;
    /**
     * The CSS `border-top-radius` property
     */
    roundedTop?: Token<CSS.Property.BorderRadius | number, "radii">;
    /**
     * The CSS `border-right-radius` property
     */
    borderRightRadius?: Token<CSS.Property.BorderRadius | number, "radii">;
    /**
     * The CSS `border-right-radius` property
     */
    roundedRight?: Token<CSS.Property.BorderRadius | number, "radii">;
    /**
     * When direction is `ltr`, `roundedEnd` is equivalent to `borderRightRadius`.
     * When direction is `rtl`, `roundedEnd` is equivalent to `borderLeftRadius`.
     */
    roundedEnd?: Token<CSS.Property.BorderRadius | number, "radii">;
    /**
     * When direction is `ltr`, `borderInlineEndRadius` is equivalent to `borderRightRadius`.
     * When direction is `rtl`, `borderInlineEndRadius` is equivalent to `borderLeftRadius`.
     */
    borderInlineEndRadius?: Token<CSS.Property.BorderRadius | number, "radii">;
    /**
     * When direction is `ltr`, `borderEndRadius` is equivalent to `borderRightRadius`.
     * When direction is `rtl`, `borderEndRadius` is equivalent to `borderLeftRadius`.
     */
    borderEndRadius?: Token<CSS.Property.BorderRadius | number, "radii">;
    /**
     * The CSS `border-bottom-radius` property
     */
    borderBottomRadius?: Token<CSS.Property.BorderRadius | number, "radii">;
    /**
     * The CSS `border-bottom-radius` property
     */
    roundedBottom?: Token<CSS.Property.BorderRadius | number, "radii">;
    /**
     * The CSS `border-left-radius` property
     */
    borderLeftRadius?: Token<CSS.Property.BorderRadius | number, "radii">;
    /**
     * The CSS `border-left-radius` property
     */
    roundedLeft?: Token<CSS.Property.BorderRadius | number, "radii">;
    /**
     * When direction is `ltr`, `roundedEnd` is equivalent to `borderRightRadius`.
     * When direction is `rtl`, `roundedEnd` is equivalent to `borderLeftRadius`.
     */
    roundedStart?: Token<CSS.Property.BorderRadius | number, "radii">;
    /**
     * When direction is `ltr`, `borderInlineStartRadius` is equivalent to `borderLeftRadius`.
     * When direction is `rtl`, `borderInlineStartRadius` is equivalent to `borderRightRadius`.
     */
    borderInlineStartRadius?: Token<CSS.Property.BorderRadius | number, "radii">;
    /**
     * When direction is `ltr`, `borderStartRadius` is equivalent to `borderLeftRadius`.
     * When direction is `rtl`, `borderStartRadius` is equivalent to `borderRightRadius`.
     */
    borderStartRadius?: Token<CSS.Property.BorderRadius | number, "radii">;
    /**
     * The CSS `border-top-left-radius` property
     */
    borderTopLeftRadius?: Token<CSS.Property.BorderRadius | number, "radii">;
    borderTopStartRadius?: Token<CSS.Property.BorderRadius | number, "radii">;
    borderStartStartRadius?: Token<CSS.Property.BorderStartStartRadius | number, "radii">;
    /**
     * The CSS `border-top-left-radius` property
     */
    roundedTopLeft?: Token<CSS.Property.BorderRadius | number, "radii">;
    roundedTopStart?: Token<CSS.Property.BorderRadius | number, "radii">;
    /**
     * The CSS `border-top-right-radius` property
     */
    borderTopRightRadius?: Token<CSS.Property.BorderRadius | number, "radii">;
    borderTopEndRadius?: Token<CSS.Property.BorderRadius | number, "radii">;
    borderStartEndRadius?: Token<CSS.Property.BorderStartEndRadius | number, "radii">;
    /**
     * The CSS `border-top-right-radius` property
     */
    roundedTopRight?: Token<CSS.Property.BorderRadius | number, "radii">;
    roundedTopEnd?: Token<CSS.Property.BorderRadius | number, "radii">;
    /**
     * The CSS `border-bottom-left-radius` property
     */
    borderBottomLeftRadius?: Token<CSS.Property.BorderRadius | number, "radii">;
    borderBottomStartRadius?: Token<CSS.Property.BorderRadius | number, "radii">;
    borderEndStartRadius?: Token<CSS.Property.BorderEndStartRadius | number, "radii">;
    /**
     * The CSS `border-bottom-left-radius` property
     */
    roundedBottomLeft?: Token<CSS.Property.BorderRadius | number, "radii">;
    roundedBottomStart?: Token<CSS.Property.BorderRadius | number, "radii">;
    /**
     * The CSS `border-bottom-right-radius` property
     */
    borderBottomRightRadius?: Token<CSS.Property.BorderRadius | number, "radii">;
    borderBottomEndRadius?: Token<CSS.Property.BorderRadius | number, "radii">;
    borderEndEndRadius?: Token<CSS.Property.BorderEndEndRadius | number, "radii">;
    /**
     * The CSS `border-bottom-right-radius` property
     */
    roundedBottomRight?: Token<CSS.Property.BorderRadius | number, "radii">;
    roundedBottomEnd?: Token<CSS.Property.BorderRadius | number, "radii">;
    /**
     * The CSS `border-right` and `border-left` property
     */
    borderX?: Token<CSS.Property.Border | number, "borders">;
    borderInline?: Token<CSS.Property.BorderInline | number>;
    /**
     * The CSS `border-top` and `border-bottom` property
     */
    borderY?: Token<CSS.Property.Border | number, "borders">;
    borderBlock?: Token<CSS.Property.BorderBlock | number>;
}

declare const color: Config$1;
interface ColorProps {
    /**
     * The CSS `color` property
     */
    textColor?: Token<CSS.Property.Color, "colors">;
    /**
     * The CSS `color` property
     */
    color?: Token<CSS.Property.Color, "colors">;
    /**
     * The CSS `fill` property for icon svgs and paths
     */
    fill?: Token<CSS.Property.Color, "colors">;
    /**
     * The CSS `stroke` property for icon svgs and paths
     */
    stroke?: Token<CSS.Property.Color, "colors">;
}

declare const effect: Config$1;
/**
 * Types for box and text shadow properties
 */
interface EffectProps {
    /**
     * The `box-shadow` property
     */
    boxShadow?: Token<CSS.Property.BoxShadow | number, "shadows">;
    /**
     * The `box-shadow` property
     */
    shadow?: Token<CSS.Property.BoxShadow | number, "shadows">;
    /**
     * The `mix-blend-mode` property
     */
    mixBlendMode?: Token<CSS.Property.MixBlendMode>;
    /**
     * The `blend-mode` property
     */
    blendMode?: Token<CSS.Property.MixBlendMode>;
    /**
     * The CSS `background-blend-mode` property
     */
    backgroundBlendMode?: Token<CSS.Property.BackgroundBlendMode>;
    /**
     * The CSS `background-blend-mode` property
     */
    bgBlendMode?: Token<CSS.Property.BackgroundBlendMode>;
    /**
     * The CSS `opacity` property
     */
    opacity?: Token<CSS.Property.Opacity>;
}

declare const filter: Config$1;
interface FilterProps {
    /**
     * The CSS `filter` property. When set to `auto`, you allow
     * Chakra UI to define the color based on the filter style props
     * (`blur`, `saturate`, etc.)
     */
    filter?: Token<CSS.Property.Filter | "auto">;
    /**
     * Sets the blur filter value of an element.
     * Value is assigned to `--chakra-filter` css variable
     */
    blur?: Token<{}, "blur">;
    /**
     * Sets the brightness filter value of an element.
     * Value is assigned to `--chakra-brightness` css variable
     */
    brightness?: Token<Length>;
    /**
     * Sets the contrast filter value of an element.
     * Value is assigned to `--chakra-contrast` css variable
     */
    contrast?: Token<Length>;
    /**
     * Sets the hue-rotate filter value of an element.
     * Value is assigned to `--chakra-hue-rotate` css variable
     */
    hueRotate?: Token<Length>;
    /**
     * Sets the invert filter value of an element.
     * Value is assigned to `--chakra-invert` css variable
     */
    invert?: Token<Length>;
    /**
     * Sets the saturation filter value of an element.
     * Value is assigned to `--chakra-saturate` css variable
     */
    saturate?: Token<Length>;
    /**
     * Sets the drop-shadow filter value of an element.
     * Value is assigned to `--chakra-drop-shadow` css variable
     */
    dropShadow?: Token<CSS.Property.BoxShadow, "shadows">;
    /**
     * The CSS `backdrop-filter` property. When set to `auto`, you allow
     * Chakra UI to define the color based on the backdrop filter style props
     * (`backdropBlur`, `backdropSaturate`, etc.)
     */
    backdropFilter?: Token<CSS.Property.BackdropFilter | "auto">;
    /**
     * Sets the backdrop-blur filter value of an element.
     * Value is assigned to `--chakra-backdrop-blur` css variable
     */
    backdropBlur?: Token<{}, "blur">;
    /**
     * Sets the backdrop-brightness filter value of an element.
     * Value is assigned to `--chakra-backdrop-brightness` css variable
     */
    backdropBrightness?: Token<Length>;
    /**
     * Sets the backdrop-contrast filter value of an element.
     * Value is assigned to `--chakra-backdrop-contrast` css variable
     */
    backdropContrast?: Token<Length>;
    /**
     * Sets the backdrop-hue-rotate filter value of an element.
     * Value is assigned to `--chakra-backdrop-hue-rotate` css variable
     */
    backdropHueRotate?: Token<Length>;
    /**
     * Sets the backdrop-invert filter value of an element.
     * Value is assigned to `--chakra-backdrop-invert` css variable
     */
    backdropInvert?: Token<Length>;
    /**
     * Sets the backdrop-saturate filter value of an element.
     * Value is assigned to `--chakra-backdrop-saturate` css variable
     */
    backdropSaturate?: Token<Length>;
}

declare const flexbox: Config$1;
interface FlexboxProps {
    /**
     * The CSS `align-items` property.
     *
     * It defines the `align-self` value on all direct children as a group.
     *
     * - In Flexbox, it controls the alignment of items on the Cross Axis.
     * - In Grid Layout, it controls the alignment of items on the Block Axis within their grid area.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/docs/Web/CSS/align-items)
     */
    alignItems?: Token<CSS.Property.AlignItems>;
    /**
     * The CSS `align-content` property.
     *
     * It defines the distribution of space between and around
     * content items along a flexbox cross-axis or a grid's block axis.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/docs/Web/CSS/align-content)
     */
    alignContent?: Token<CSS.Property.AlignContent>;
    /**
     * The CSS `justify-items` property.
     *
     * It defines the default `justify-self` for all items of the box,
     * giving them all a default way of justifying each box
     * along the appropriate axis.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/docs/Web/CSS/justify-items)
     */
    justifyItems?: Token<CSS.Property.JustifyItems>;
    /**
     * The CSS `justify-content` property.
     *
     * It defines how the browser distributes space between and around content items
     * along the main-axis of a flex container, and the inline axis of a grid container.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/docs/Web/CSS/justify-content)
     */
    justifyContent?: Token<CSS.Property.JustifyContent>;
    /**
     * The CSS `flex-wrap` property.
     *
     * It defines whether flex items are forced onto one line or
     * can wrap onto multiple lines. If wrapping is allowed,
     * it sets the direction that lines are stacked.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/docs/Web/CSS/flex-wrap)
     */
    flexWrap?: Token<CSS.Property.FlexWrap>;
    /**
     * The CSS `flex-flow` property.
     *
     * It is a shorthand property for `flex-direction` and `flex-wrap`.
     * It specifies the direction of a flex container, as well as its wrapping behavior.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/docs/Web/CSS/flex-flow)
     */
    flexFlow?: Token<CSS.Property.FlexFlow>;
    /**
     * The CSS `flex-basis` property.
     *
     * It defines the initial main size of a flex item.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/docs/Web/CSS/flex-basis)
     */
    flexBasis?: Token<CSS.Property.FlexBasis<Length>>;
    /**
     * The CSS `flex-direction` property.
     *
     * It defines how flex items are placed in the flex container
     * defining the main axis and the direction (normal or reversed).
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/docs/Web/CSS/flex-direction)
     */
    flexDirection?: Token<CSS.Property.FlexDirection>;
    /**
     * The CSS `flex-direction` property.
     *
     * It defines how flex items are placed in the flex container
     * defining the main axis and the direction (normal or reversed).
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/docs/Web/CSS/flex-direction)
     */
    flexDir?: Token<CSS.Property.FlexDirection>;
    /**
     * The CSS `flex` property.
     *
     * It defines how a flex item will grow or shrink
     * to fit the space available in its flex container.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/docs/Web/CSS/flex)
     */
    flex?: Token<CSS.Property.Flex<Length>>;
    /**
     * The CSS `gap` property.
     *
     * It defines the gap between items in both flex and
     * grid contexts.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/docs/Web/CSS/gap)
     */
    gap?: Token<CSS.Property.Gap<Length>, "space">;
    /**
     * The CSS `row-gap` property.
     *
     * It sets the size of the gap (gutter) between an element's grid rows.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/docs/Web/CSS/row-gap)
     */
    rowGap?: Token<CSS.Property.RowGap<Length>, "space">;
    /**
     * The CSS `column-gap` property.
     *
     * It sets the size of the gap (gutter) between an element's columns.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/docs/Web/CSS/column-gap)
     */
    columnGap?: Token<CSS.Property.ColumnGap<Length>, "space">;
    /**
     * The CSS `justify-self` property.
     *
     * It defines the way a box is justified inside its
     * alignment container along the appropriate axis.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/docs/Web/CSS/flex-flow)
     */
    justifySelf?: Token<CSS.Property.JustifySelf>;
    /**
     * The CSS `align-self` property.
     *
     * It works like `align-items`, but applies only to a
     * single flexbox item, instead of all of them.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/docs/Web/CSS/align-self)
     */
    alignSelf?: Token<CSS.Property.AlignSelf>;
    /**
     * The CSS `order` property.
     *
     * It defines the order to lay out an item in a flex or grid container.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/docs/Web/CSS/order)
     */
    order?: Token<CSS.Property.Order>;
    /**
     * The CSS `flex-grow` property.
     *
     * It defines how much a flexbox item should grow
     * if there's space available.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/docs/Web/CSS/flex-grow)
     */
    flexGrow?: Token<CSS.Property.FlexGrow | (string & number)>;
    /**
     * The CSS `flex-shrink` property.
     *
     * It defines how much a flexbox item should shrink
     * if there's not enough space available.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/docs/Web/CSS/flex-shrink)
     */
    flexShrink?: Token<CSS.Property.FlexShrink | (string & number)>;
    /**
     * The CSS `place-items` property.
     *
     * It allows you to align items along both the block and
     * inline directions at once (i.e. the align-items and justify-items properties)
     * in a relevant layout system such as `Grid` or `Flex`.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/docs/Web/CSS/place-items)
     */
    placeItems?: Token<CSS.Property.PlaceItems>;
    /**
     * The CSS `place-content` property.
     *
     * It allows you to align content along both the block and
     * inline directions at once (i.e. the align-content and justify-content properties)
     * in a relevant layout system such as Grid or Flexbox.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/docs/Web/CSS/place-content)
     */
    placeContent?: Token<CSS.Property.PlaceContent>;
    /**
     * The CSS `place-self` property.
     *
     * It allows you to align an individual item in both the block and
     * inline directions at once (i.e. the align-self and justify-self properties)
     * in a relevant layout system such as Grid or Flexbox.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/docs/Web/CSS/place-self)
     */
    placeSelf?: Token<CSS.Property.PlaceSelf>;
}

declare const grid: Config$1;
interface GridProps {
    /**
     * The CSS `grid-gap` property.
     *
     * It defines the gaps (gutters) between rows and columns
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-gap)
     */
    gridGap?: Token<CSS.Property.GridGap | number, "space">;
    /**
     * The CSS `grid-column-gap` property.
     *
     * It defines the size of the gap (gutter) between an element's columns.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/column-gap)
     */
    gridColumnGap?: Token<CSS.Property.GridColumnGap | number, "space">;
    /**
     * The CSS `grid-row-gap` property.
     *
     * It defines the size of the gap (gutter) between an element's grid rows.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/row-gap)
     */
    gridRowGap?: Token<CSS.Property.GridRowGap | number, "space">;
    /**
     * The CSS `grid-column` property.
     *
     * It specifies a grid item’s start position within the grid column by
     * contributing a line, a span, or nothing (automatic) to its grid placement
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column-start)
     */
    gridColumnStart?: Token<CSS.Property.GridColumnStart>;
    /**
     * The CSS `grid-row-start` property
     *
     * It specifies a grid item’s start position within the grid row by
     * contributing a line, a span, or nothing (automatic) to its grid placement,
     * thereby specifying the `inline-start` edge of its grid area.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row-start)
     */
    gridRowStart?: Token<CSS.Property.GridRowStart>;
    /**
     * The CSS `grid-row-end` property
     *
     * It specifies a grid item’s end position within the grid row by
     * contributing a line, a span, or nothing (automatic) to its grid placement,
     * thereby specifying the `inline-end` edge of its grid area.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row-end)
     */
    gridRowEnd?: Token<CSS.Property.GridRowEnd>;
    /**
     * The CSS `grid-template` property.
     *
     * It is a shorthand property for defining grid columns, rows, and areas.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template)
     */
    gridTemplate?: Token<CSS.Property.GridTemplate>;
    /**
     * The CSS `grid-column` property
     *
     * It specifies a grid item’s end position within the grid column by
     * contributing a line, a span, or nothing (automatic) to its grid placement,
     * thereby specifying the block-end edge of its grid area.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column-end)
     */
    gridColumnEnd?: Token<CSS.Property.GridColumnEnd>;
    /**
     * The CSS `grid-column` property.
     *
     * It specifies a grid item's size and location within a grid column
     * by contributing a line, a span, or nothing (automatic) to its grid placement,
     * thereby specifying the `inline-start` and `inline-end` edge of its grid area.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column)
     */
    gridColumn?: Token<CSS.Property.GridColumn>;
    /**
     * The CSS `grid-row` property
     *
     * It specifies a grid item’s size and location within the grid row
     * by contributing a line, a span, or nothing (automatic) to its grid placement,
     * thereby specifying the `inline-start` and `inline-end` edge of its grid area.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row)
     */
    gridRow?: Token<CSS.Property.GridRow>;
    /**
     * The CSS `grid-auto-flow` property
     *
     * It controls how the auto-placement algorithm works,
     * specifying exactly how auto-placed items get flowed into the grid.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-flow)
     */
    gridAutoFlow?: Token<CSS.Property.GridAutoFlow>;
    /**
     * The CSS `grid-auto-columns` property.
     *
     * It specifies the size of an implicitly-created grid column track or pattern of tracks.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-columns)
     */
    gridAutoColumns?: Token<CSS.Property.GridAutoColumns>;
    /**
     * The CSS `grid-auto-rows` property.
     *
     * It specifies the size of an implicitly-created grid row track or pattern of tracks.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-rows)
     */
    gridAutoRows?: Token<CSS.Property.GridAutoRows>;
    /**
     * The CSS `grid-template-columns` property
     *
     * It defines the line names and track sizing functions of the grid columns.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns)
     */
    gridTemplateColumns?: Token<CSS.Property.GridTemplateColumns>;
    /**
     * The CSS `grid-template-rows` property.
     *
     * It defines the line names and track sizing functions of the grid rows.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-rows)
     */
    gridTemplateRows?: Token<CSS.Property.GridTemplateRows>;
    /**
     * The CSS `grid-template-areas` property.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas)
     */
    gridTemplateAreas?: Token<CSS.Property.GridTemplateAreas>;
    /**
     * The CSS `grid-areas` property.
     *
     * It specifies a grid item’s size and location within a grid by
     * contributing a line, a span, or nothing (automatic)
     * to its grid placement, thereby specifying the edges of its grid area.
     *
     * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-area)
     */
    gridArea?: Token<CSS.Property.GridArea>;
}

declare const interactivity: Config$1;
interface InteractivityProps {
    /**
     * The CSS `appearance` property
     */
    appearance?: Token<CSS.Property.Appearance>;
    /**
     * The CSS `user-select` property
     */
    userSelect?: Token<CSS.Property.UserSelect>;
    /**
     * The CSS `pointer-events` property
     */
    pointerEvents?: Token<CSS.Property.PointerEvents>;
    /**
     * The CSS `resize` property
     */
    resize?: Token<CSS.Property.Resize>;
    /**
     * The CSS `cursor` property
     */
    cursor?: Token<CSS.Property.Cursor>;
    /**
     * The CSS `outline` property
     */
    outline?: Token<CSS.Property.Outline<Length>>;
    /**
     * The CSS `outline-offset` property
     */
    outlineOffset?: Token<CSS.Property.OutlineOffset<Length>>;
    /**
     * The CSS `outline-color` property
     */
    outlineColor?: Token<CSS.Property.Color, "colors">;
}

declare const layout: Config$1;
/**
 * Types for layout related CSS properties
 */
interface LayoutProps {
    /**
     * The CSS `display` property
     */
    display?: Token<CSS.Property.Display>;
    /**
     * Hides an element from the specified breakpoint and up
     */
    hideFrom?: Token<string & {}, "breakpoints">;
    /**
     * Hides an element below the specified breakpoint
     */
    hideBelow?: Token<string & {}, "breakpoints">;
    /**
     * The CSS `width` property
     */
    width?: Token<CSS.Property.Width | number, "sizes">;
    /**
     * The CSS `width` property
     */
    w?: Token<CSS.Property.Width | number, "sizes">;
    inlineSize?: Token<CSS.Property.InlineSize | number, "sizes">;
    /**
     * The CSS `width` and `height` property
     */
    boxSize?: Token<CSS.Property.Width | number, "sizes">;
    /**
     * The CSS `max-width` property
     */
    maxWidth?: Token<CSS.Property.MaxWidth | number, "sizes">;
    /**
     * The CSS `max-width` property
     */
    maxW?: Token<CSS.Property.MaxWidth | number, "sizes">;
    maxInlineSize?: Token<CSS.Property.MaxInlineSize | number, "sizes">;
    /**
     * The CSS `min-width` property
     */
    minWidth?: Token<CSS.Property.MinWidth | number, "sizes">;
    /**
     * The CSS `min-width` property
     */
    minW?: Token<CSS.Property.MinWidth | number, "sizes">;
    minInlineSize?: Token<CSS.Property.MinInlineSize | number, "sizes">;
    /**
     * The CSS `height` property
     */
    height?: Token<CSS.Property.Height | number, "sizes">;
    /**
     * The CSS `height` property
     */
    h?: Token<CSS.Property.Height | number, "sizes">;
    blockSize?: Token<CSS.Property.BlockSize | number, "sizes">;
    /**
     * The CSS `max-height` property
     */
    maxHeight?: Token<CSS.Property.MaxHeight | number, "sizes">;
    /**
     * The CSS `max-height` property
     */
    maxH?: Token<CSS.Property.MaxHeight | number, "sizes">;
    maxBlockSize?: Token<CSS.Property.MaxBlockSize | number, "sizes">;
    /**
     * The CSS `min-height` property
     */
    minHeight?: Token<CSS.Property.MinHeight | number, "sizes">;
    /**
     * The CSS `min-height` property
     */
    minH?: Token<CSS.Property.MinHeight | number, "sizes">;
    minBlockSize?: Token<CSS.Property.MinBlockSize | number, "sizes">;
    /**
     * The CSS `vertical-align` property
     */
    verticalAlign?: Token<CSS.Property.VerticalAlign<Length>>;
    /**
     * The CSS `overflow` property
     */
    overflow?: Token<CSS.Property.Overflow>;
    /**
     * The CSS `overflow-x` property
     */
    overflowX?: Token<CSS.Property.OverflowX>;
    /**
     * The CSS `overflow-y` property
     */
    overflowY?: Token<CSS.Property.OverflowY>;
    /**
     * The CSS `box-sizing` property
     */
    boxSizing?: CSS.Property.BoxSizing;
    /**
     * The CSS `box-decoration` property
     */
    boxDecorationBreak?: Token<CSS.Property.BoxDecorationBreak>;
    /**
     * The CSS `float` property
     */
    float?: Token<CSS.Property.Float>;
    /**
     * The CSS `object-fit` property
     */
    objectFit?: Token<CSS.Property.ObjectFit>;
    /**
     * The CSS `object-position` property
     */
    objectPosition?: Token<CSS.Property.ObjectPosition<Length>>;
    /**
     * The CSS `overscroll-behavior` property
     */
    overscrollBehavior?: Token<CSS.Property.OverscrollBehavior>;
    /**
     * The CSS `overscroll-behavior` property
     */
    overscroll?: Token<CSS.Property.OverscrollBehavior>;
    /**
     * The CSS `overscroll-behavior-x` property
     */
    overscrollBehaviorX?: Token<CSS.Property.OverscrollBehaviorX>;
    /**
     * The CSS `overscroll-behavior-x` property
     */
    overscrollX?: Token<CSS.Property.OverscrollBehaviorX>;
    /**
     * The CSS `overscroll-behavior-y` property
     */
    overscrollBehaviorY?: Token<CSS.Property.OverscrollBehaviorY>;
    /**
     * The CSS `overscroll-behavior-y` property
     */
    overscrollY?: Token<CSS.Property.OverscrollBehaviorY>;
    /**
     * The CSS `visibility` property
     */
    visibility?: Token<CSS.Property.Visibility>;
    /**
     * The CSS `isolation` property
     */
    isolation?: Token<CSS.Property.Isolation>;
    /**
     * The CSS `aspect-ratio` property
     */
    aspectRatio?: Token<CSS.Property.AspectRatio>;
}

declare const list: Config$1;
interface ListProps {
    listStyleType?: ResponsiveValue<CSS.Property.ListStyleType>;
    /**
     * The CSS `list-style-position` property
     */
    listStylePosition?: ResponsiveValue<CSS.Property.ListStylePosition>;
    /**
     * The CSS `list-style-position` property
     */
    listStylePos?: ResponsiveValue<CSS.Property.ListStylePosition>;
    /**
     * The CSS `list-style-image` property
     */
    listStyleImage?: ResponsiveValue<CSS.Property.ListStyleImage>;
    /**
     * The CSS `list-style-image` property
     */
    listStyleImg?: ResponsiveValue<CSS.Property.ListStyleImage>;
}

declare const others: Config$1;
interface OtherProps {
    /**
     * If `true`, hide an element visually without hiding it from screen readers.
     *
     * If `focusable`, the sr-only styles will be undone, making the element visible
     * to sighted users as well as screen readers.
     */
    srOnly?: true | "focusable";
    /**
     * The layer style object to apply.
     * Note: Styles must be located in `theme.layerStyles`
     */
    layerStyle?: Token<string & {}, "layerStyles">;
    /**
     * The text style object to apply.
     * Note: Styles must be located in `theme.textStyles`
     */
    textStyle?: Token<string & {}, "textStyles">;
    /**
     * Apply theme-aware style objects in `theme`
     *
     * @example
     * ```jsx
     * <Box apply="styles.h3">This is a div</Box>
     * ```
     *
     * This will apply styles defined in `theme.styles.h3`
     */
    apply?: ResponsiveValue<string>;
}

declare const position: Config$1;
/**
 * Types for position CSS properties
 */
interface PositionProps {
    /**
     * The CSS `z-index` property
     */
    zIndex?: Token<CSS.Property.ZIndex, "zIndices">;
    /**
     * The CSS `top` property
     */
    top?: Token<CSS.Property.Top | number, "sizes">;
    insetBlockStart?: Token<CSS.Property.InsetBlockStart | number, "sizes">;
    /**
     * The CSS `right` property
     */
    right?: Token<CSS.Property.Right | number, "sizes">;
    /**
     * When the direction is `ltr`, `insetInlineEnd` is equivalent to `right`.
     * When the direction is `rtl`, `insetInlineEnd` is equivalent to `left`.
     */
    insetInlineEnd?: Token<CSS.Property.InsetInlineEnd | number, "sizes">;
    /**
     * When the direction is `ltr`, `insetEnd` is equivalent to `right`.
     * When the direction is `rtl`, `insetEnd` is equivalent to `left`.
     */
    insetEnd?: Token<CSS.Property.InsetInlineEnd | number, "sizes">;
    /**
     * The CSS `bottom` property
     */
    bottom?: Token<CSS.Property.Bottom | number, "sizes">;
    insetBlockEnd?: Token<CSS.Property.InsetBlockEnd | number, "sizes">;
    /**
     * The CSS `left` property
     */
    left?: Token<CSS.Property.Left | number, "sizes">;
    insetInlineStart?: Token<CSS.Property.InsetInlineStart | number, "sizes">;
    /**
     * When the direction is `start`, `end` is equivalent to `left`.
     * When the direction is `start`, `end` is equivalent to `right`.
     */
    insetStart?: Token<CSS.Property.InsetInlineStart | number, "sizes">;
    /**
     * The CSS `left`, `right`, `top`, `bottom` property
     */
    inset?: Token<CSS.Property.Inset | number, "sizes">;
    /**
     * The CSS `left`, and `right` property
     */
    insetX?: Token<CSS.Property.Inset | number, "sizes">;
    /**
     * The CSS `top`, and `bottom` property
     */
    insetY?: Token<CSS.Property.Inset | number, "sizes">;
    /**
     * The CSS `position` property
     */
    pos?: Token<CSS.Property.Position>;
    /**
     * The CSS `position` property
     */
    position?: Token<CSS.Property.Position>;
    insetInline?: Token<CSS.Property.InsetInline>;
    insetBlock?: Token<CSS.Property.InsetBlock>;
}

/**
 * The parser configuration for common outline properties
 */
declare const ring: Config$1;
interface RingProps {
    /**
     * Creates outline rings with CSS `box-shadow` property
     */
    ring?: Token<Length>;
    /**
     * The color of the outline ring
     */
    ringColor?: Token<CSS.Property.Color, "colors">;
    /**
     * The thickness of the offset shadow when using outline rings
     */
    ringOffset?: Token<Length>;
    /**
     * The color of the offset shadow when adding outline rings
     */
    ringOffsetColor?: Token<CSS.Property.Color, "colors">;
    /**
     * If the outline ring should an `inset`
     */
    ringInset?: Token<"inset" | "none">;
}

declare const space: Config$1;
/**
 * Types for space related CSS properties
 */
interface SpaceProps {
    /**
     * Margin on top, left, bottom and right
     */
    m?: Token<CSS.Property.Margin | number, "space">;
    /**
     * Margin on top, left, bottom and right
     */
    margin?: Token<CSS.Property.Margin | number, "space">;
    /**
     * Margin on top
     */
    mt?: Token<CSS.Property.Margin | number, "space">;
    marginBlockStart?: Token<CSS.Property.MarginBlockStart | number, "space">;
    /**
     * Margin on top
     */
    marginTop?: Token<CSS.Property.MarginTop | number, "space">;
    /**
     * Margin on right
     */
    mr?: Token<CSS.Property.MarginRight | number, "space">;
    /**
     * When direction is `ltr`, `marginInlineEnd` is equivalent to `marginRight`.
     * When direction is `rtl`, `marginInlineEnd` is equivalent to `marginLeft`.
     */
    marginInlineEnd?: Token<CSS.Property.MarginInlineEnd | number, "space">;
    /**
     * When direction is `ltr`, `marginEnd` is equivalent to `marginRight`.
     * When direction is `rtl`, `marginEnd` is equivalent to `marginLeft`.
     */
    marginEnd?: Token<CSS.Property.MarginInlineEnd | number, "space">;
    /**
     * When direction is `ltr`, `me` is equivalent to `marginRight`.
     * When direction is `rtl`, `me` is equivalent to `marginLeft`.
     */
    me?: Token<CSS.Property.MarginInlineEnd | number, "space">;
    /**
     * Margin on right
     */
    marginRight?: Token<CSS.Property.MarginRight | number, "space">;
    /**
     * Margin on bottom
     */
    mb?: Token<CSS.Property.MarginBottom | number, "space">;
    marginBlockEnd?: Token<CSS.Property.MarginBlockEnd | number, "space">;
    /**
     * Margin on bottom
     */
    marginBottom?: Token<CSS.Property.MarginBottom | number, "space">;
    /**
     * Margin on left
     */
    ml?: Token<CSS.Property.MarginLeft | number, "space">;
    /**
     * When direction is `ltr`, `marginInlineStart` is equivalent to `marginLeft`.
     * When direction is `rtl`, `marginInlineStart` is equivalent to `marginRight`.
     */
    marginInlineStart?: Token<CSS.Property.MarginInlineStart | number, "space">;
    /**
     * When direction is `ltr`, `marginStart` is equivalent to `marginLeft`.
     * When direction is `rtl`, `marginStart` is equivalent to `marginRight`.
     */
    marginStart?: Token<CSS.Property.MarginInlineStart | number, "space">;
    /**
     * When direction is `ltr`, `ms` is equivalent to `marginLeft`.
     * When direction is `rtl`, `ms` is equivalent to `marginRight`.
     */
    ms?: Token<CSS.Property.MarginInlineStart | number, "space">;
    /**
     * Margin on left
     */
    marginLeft?: Token<CSS.Property.MarginLeft | number, "space">;
    /**
     * Margin on left and right
     */
    mx?: Token<CSS.Property.Margin | number, "space">;
    marginInline?: Token<CSS.Property.MarginInline | number, "space">;
    /**
     * Margin on left and right
     */
    marginX?: Token<CSS.Property.Margin | number, "space">;
    /**
     * Margin on top and bottom
     */
    my?: Token<CSS.Property.Margin | number, "space">;
    marginBlock?: Token<CSS.Property.MarginBlock | number, "space">;
    /**
     * Margin on top and bottom
     */
    marginY?: Token<CSS.Property.Margin | number, "space">;
    /**
     * Padding on top, left, bottom and right
     */
    p?: Token<CSS.Property.Padding | number, "space">;
    /**
     * Padding on top, left, bottom and right
     */
    padding?: Token<CSS.Property.Padding | number, "space">;
    /**
     * Padding on top
     */
    pt?: Token<CSS.Property.PaddingTop | number, "space">;
    paddingBlockStart?: Token<CSS.Property.PaddingBlockStart | number, "space">;
    /**
     * Padding on top
     */
    paddingTop?: Token<CSS.Property.PaddingTop | number, "space">;
    /**
     * Padding on right
     */
    pr?: Token<CSS.Property.PaddingRight | number, "space">;
    /**
     * When direction is `ltr`, `paddingInlineEnd` is equivalent to `paddingRight`.
     * When direction is `rtl`, `paddingInlineEnd` is equivalent to `paddingLeft`.
     */
    paddingInlineEnd?: Token<CSS.Property.PaddingInlineEnd | number, "space">;
    /**
     * When direction is `ltr`, `paddingEnd` is equivalent to `paddingRight`.
     * When direction is `rtl`, `paddingEnd` is equivalent to `paddingLeft`.
     */
    paddingEnd?: Token<CSS.Property.PaddingInlineEnd | number, "space">;
    /**
     * When direction is `ltr`, `pe` is equivalent to `paddingRight`.
     * When direction is `rtl`, `pe` is equivalent to `paddingLeft`.
     */
    pe?: Token<CSS.Property.PaddingInlineEnd | number, "space">;
    /**
     * Padding on right
     */
    paddingRight?: Token<CSS.Property.PaddingRight | number, "space">;
    /**
     * Padding on bottom
     */
    pb?: Token<CSS.Property.PaddingBottom | number, "space">;
    paddingBlockEnd?: Token<CSS.Property.PaddingBlockEnd | number, "space">;
    /**
     * Padding on bottom
     */
    paddingBottom?: Token<CSS.Property.PaddingBottom | number, "space">;
    /**
     * Padding on left
     */
    pl?: Token<CSS.Property.PaddingLeft | number, "space">;
    /**
     * When direction is `ltr`, `paddingInlineStart` is equivalent to `paddingLeft`.
     * When direction is `rtl`, `paddingInlineStart` is equivalent to `paddingRight`.
     */
    paddingInlineStart?: Token<CSS.Property.PaddingInlineStart | number, "space">;
    /**
     * When direction is `ltr`, `paddingStart` is equivalent to `paddingLeft`.
     * When direction is `rtl`, `paddingStart` is equivalent to `paddingRight`.
     */
    paddingStart?: Token<CSS.Property.PaddingInlineStart | number, "space">;
    /**
     * When direction is `ltr`, `ps` is equivalent to `paddingLeft`.
     * When direction is `rtl`, `ps` is equivalent to `paddingRight`.
     */
    ps?: Token<CSS.Property.PaddingInlineStart | number, "space">;
    /**
     * Padding on left
     */
    paddingLeft?: Token<CSS.Property.PaddingLeft | number, "space">;
    /**
     * Padding on left and right
     */
    px?: Token<CSS.Property.Padding | number, "space">;
    paddingInline?: Token<CSS.Property.PaddingInline | number, "space">;
    /**
     * Padding on left and right
     */
    paddingX?: Token<CSS.Property.Padding | number, "space">;
    /**
     * Padding on top and bottom
     */
    py?: Token<CSS.Property.Padding | number, "space">;
    paddingBlock?: Token<CSS.Property.PaddingBlock | number, "space">;
    /**
     * Padding on top and bottom
     */
    paddingY?: Token<CSS.Property.Padding | number, "space">;
}

declare const textDecoration: Config$1;
interface TextDecorationProps {
    /**
     * The CSS `text-decoration` property
     */
    textDecoration?: Token<CSS.Property.TextDecoration | number>;
    /**
     * The CSS `text-decoration` property
     */
    textDecor?: Token<CSS.Property.TextDecoration | number>;
    /**
     * The CSS `text-decoration-color` property
     */
    textDecorationColor?: Token<CSS.Property.TextDecorationColor, "colors">;
    /**
     * The CSS `text-decoration-thickness` property
     */
    textDecorationThickness?: ResponsiveValue<CSS.Property.TextDecorationThickness>;
    /**
     * The CSS `text-decoration-style` property
     */
    textDecorationStyle?: ResponsiveValue<CSS.Property.TextDecorationStyle>;
    /**
     * The CSS `text-decoration-line` property
     */
    textDecorationLine?: ResponsiveValue<CSS.Property.TextDecorationLine>;
    /**
     * The CSS `text-underline-offset` property
     */
    textUnderlineOffset?: ResponsiveValue<CSS.Property.TextUnderlineOffset | number>;
    /**
     * The `text-shadow` property
     */
    textShadow?: Token<CSS.Property.TextShadow | number, "shadows">;
}

declare const transform: Config$1;
interface TransformProps {
    /**
     * The CSS `transform` property
     */
    transform?: Token<CSS.Property.Transform | "auto" | "auto-gpu">;
    /**
     * The CSS `transform-origin` property
     */
    transformOrigin?: Token<CSS.Property.TransformOrigin | number, "sizes">;
    /**
     * The CSS `clip-path` property.
     *
     * It creates a clipping region that sets what part of an element should be shown.
     */
    clipPath?: Token<CSS.Property.ClipPath>;
    /**
     * Translate value of an elements in the x-direction.
     * - Only works if `transform=auto`
     * - It sets the value of `--chakra-translate-x`
     */
    translateX?: Token<Length>;
    /**
     * Translate value of an elements in the y-direction.
     * - Only works if `transform=auto`
     * - It sets the value of `--chakra-translate-y`
     */
    translateY?: Token<Length>;
    /**
     * Sets the rotation value of the element
     */
    rotate?: Token<Length>;
    /**
     * Skew value of an elements in the x-direction.
     * - Only works if `transform=auto`
     * - It sets the value of `--chakra-skew-x`
     */
    skewX?: Token<Length>;
    /**
     * Skew value of an elements in the y-direction.
     * - Only works if `transform=auto`
     * - It sets the value of `--chakra-skew-y`
     */
    skewY?: Token<Length>;
    /**
     * Scale value of an elements in the x-direction.
     * - Only works if `transform=auto`
     * - It sets the value of `--chakra-scale-x`
     */
    scaleX?: Token<Length>;
    /**
     * Scale value of an elements in the y-direction.
     * - Only works if `transform=auto`
     * - It sets the value of `--chakra-scale-y`
     */
    scaleY?: Token<Length>;
    /**
     * Sets the scale value of the element
     */
    scale?: Token<Length>;
}

declare const transition: Config$1;
interface TransitionProps {
    /**
     * The CSS `transition` property
     */
    transition?: Token<CSS.Property.Transition>;
    /**
     * The CSS `transition-property` property
     */
    transitionProperty?: Token<CSS.Property.TransitionProperty>;
    /**
     * The CSS `transition-timing-function` property
     */
    transitionTimingFunction?: Token<CSS.Property.TransitionTimingFunction>;
    /**
     * The CSS `transition-duration` property
     */
    transitionDuration?: Token<string>;
    /**
     * The CSS `transition-delay` property
     */
    transitionDelay?: Token<CSS.Property.TransitionDelay>;
    /**
     * The CSS `animation` property
     */
    animation?: Token<CSS.Property.Animation>;
    /**
     * The CSS `will-change` property
     */
    willChange?: Token<CSS.Property.WillChange>;
}

declare const typography: Config$1;
/**
 * Types for typography related CSS properties
 */
interface TypographyProps {
    /**
     * The CSS `font-weight` property
     */
    fontWeight?: Token<number | (string & {}), "fontWeights">;
    /**
     * The CSS `line-height` property
     */
    lineHeight?: Token<CSS.Property.LineHeight | number, "lineHeights">;
    /**
     * The CSS `letter-spacing` property
     */
    letterSpacing?: Token<CSS.Property.LetterSpacing | number, "letterSpacings">;
    /**
     * The CSS `font-size` property
     */
    fontSize?: Token<CSS.Property.FontSize | number, "fontSizes">;
    /**
     * The CSS `font-family` property
     */
    fontFamily?: Token<CSS.Property.FontFamily, "fonts">;
    /**
     * The CSS `text-align` property
     */
    textAlign?: Token<CSS.Property.TextAlign>;
    /**
     * The CSS `font-style` property
     */
    fontStyle?: Token<CSS.Property.FontStyle>;
    /**
     * The CSS `text-indent` property
     */
    textIndent?: Token<CSS.Property.TextIndent>;
    /**
     * The CSS `word-break` property
     */
    wordBreak?: Token<CSS.Property.WordBreak>;
    /**
     * The CSS `overflow-wrap` property
     */
    overflowWrap?: Token<CSS.Property.OverflowWrap>;
    /**
     * The CSS `text-overflow` property
     */
    textOverflow?: Token<CSS.Property.TextOverflow>;
    /**
     * The CSS `text-transform` property
     */
    textTransform?: Token<CSS.Property.TextTransform>;
    /**
     * The CSS `white-space` property
     */
    whiteSpace?: Token<CSS.Property.WhiteSpace>;
    /**
     * Used to visually truncate a text after a number of lines.
     */
    noOfLines?: ResponsiveValue<number>;
    /**
     * If `true`, it clamps truncate a text after one line.
     */
    isTruncated?: boolean;
}

declare const scroll: Config$1;
interface ScrollProps {
    scrollBehavior?: Token<CSS.Property.ScrollBehavior>;
    scrollSnapAlign?: Token<CSS.Property.ScrollSnapAlign>;
    scrollSnapStop?: Token<CSS.Property.ScrollSnapStop>;
    scrollSnapType?: Token<CSS.Property.ScrollSnapType>;
    scrollMargin?: Token<CSS.Property.ScrollMargin | number, "space">;
    scrollMarginTop?: Token<CSS.Property.ScrollMarginTop | number, "space">;
    scrollMarginBottom?: Token<CSS.Property.ScrollMarginBottom | number, "space">;
    scrollMarginLeft?: Token<CSS.Property.ScrollMarginLeft | number, "space">;
    scrollMarginRight?: Token<CSS.Property.ScrollMarginRight | number, "space">;
    scrollMarginX?: Token<CSS.Property.ScrollMargin | number, "space">;
    scrollMarginY?: Token<CSS.Property.ScrollMargin | number, "space">;
    scrollPadding?: Token<CSS.Property.ScrollPadding | number, "space">;
    scrollPaddingTop?: Token<CSS.Property.ScrollPaddingTop | number, "space">;
    scrollPaddingBottom?: Token<CSS.Property.ScrollPaddingBottom | number, "space">;
    scrollPaddingLeft?: Token<CSS.Property.ScrollPaddingLeft | number, "space">;
    scrollPaddingRight?: Token<CSS.Property.ScrollPaddingRight | number, "space">;
    scrollPaddingX?: Token<CSS.Property.ScrollPadding | number, "space">;
    scrollPaddingY?: Token<CSS.Property.ScrollPadding | number, "space">;
}

declare const pseudoSelectors: {
    /**
     * Styles for CSS selector `&:hover`
     */
    _hover: string;
    /**
     * Styles for CSS Selector `&:active`
     */
    _active: string;
    /**
     * Styles for CSS selector `&:focus`
     *
     */
    _focus: string;
    /**
     * Styles for the highlighted state.
     */
    _highlighted: string;
    /**
     * Styles to apply when a child of this element has received focus
     * - CSS Selector `&:focus-within`
     */
    _focusWithin: string;
    /**
     * Styles to apply when this element has received focus via tabbing
     * - CSS Selector `&:focus-visible`
     */
    _focusVisible: string;
    /**
     * Styles to apply when this element is disabled. The passed styles are applied to these CSS selectors:
     * - `&[aria-disabled=true]`
     * - `&:disabled`
     * - `&[data-disabled]`
     * - `&[disabled]`
     */
    _disabled: string;
    /**
     * Styles for CSS Selector `&:readonly`
     */
    _readOnly: string;
    /**
     * Styles for CSS selector `&::before`
     *
     * NOTE:When using this, ensure the `content` is wrapped in a backtick.
     * @example
     * ```jsx
     * <Box _before={{content:`""` }}/>
     * ```
     */
    _before: string;
    /**
     * Styles for CSS selector `&::after`
     *
     * NOTE:When using this, ensure the `content` is wrapped in a backtick.
     * @example
     * ```jsx
     * <Box _after={{content:`""` }}/>
     * ```
     */
    _after: string;
    /**
     * Styles for CSS selector `&:empty`
     */
    _empty: string;
    /**
     * Styles to apply when the ARIA attribute `aria-expanded` is `true`
     * - CSS selector `&[aria-expanded=true]`
     */
    _expanded: string;
    /**
     * Styles to apply when the ARIA attribute `aria-checked` is `true`
     * - CSS selector `&[aria-checked=true]`
     */
    _checked: string;
    /**
     * Styles to apply when the ARIA attribute `aria-grabbed` is `true`
     * - CSS selector `&[aria-grabbed=true]`
     */
    _grabbed: string;
    /**
     * Styles for CSS Selector `&[aria-pressed=true]`
     * Typically used to style the current "pressed" state of toggle buttons
     */
    _pressed: string;
    /**
     * Styles to apply when the ARIA attribute `aria-invalid` is `true`
     * - CSS selector `&[aria-invalid=true]`
     */
    _invalid: string;
    /**
     * Styles for the valid state
     * - CSS selector `&[data-valid], &[data-state=valid]`
     */
    _valid: string;
    /**
     * Styles for CSS Selector `&[aria-busy=true]` or `&[data-loading=true]`.
     * Useful for styling loading states
     */
    _loading: string;
    /**
     * Styles to apply when the ARIA attribute `aria-selected` is `true`
     *
     * - CSS selector `&[aria-selected=true]`
     */
    _selected: string;
    /**
     * Styles for CSS Selector `[hidden=true]`
     */
    _hidden: string;
    /**
     * Styles for CSS Selector `&:-webkit-autofill`
     */
    _autofill: string;
    /**
     * Styles for CSS Selector `&:nth-child(even)`
     */
    _even: string;
    /**
     * Styles for CSS Selector `&:nth-child(odd)`
     */
    _odd: string;
    /**
     * Styles for CSS Selector `&:first-of-type`
     */
    _first: string;
    /**
     * Styles for CSS selector `&::first-letter`
     *
     * NOTE: This selector is only applied for block-level elements and not preceded by an image or table.
     * @example
     * ```jsx
     * <Text _firstLetter={{ textDecoration: 'underline' }}>Once upon a time</Text>
     * ```
     */
    _firstLetter: string;
    /**
     * Styles for CSS Selector `&:last-of-type`
     */
    _last: string;
    /**
     * Styles for CSS Selector `&:not(:first-of-type)`
     */
    _notFirst: string;
    /**
     * Styles for CSS Selector `&:not(:last-of-type)`
     */
    _notLast: string;
    /**
     * Styles for CSS Selector `&:visited`
     */
    _visited: string;
    /**
     * Used to style the active link in a navigation
     * Styles for CSS Selector `&[aria-current=page]`
     */
    _activeLink: string;
    /**
     * Used to style the current step within a process
     * Styles for CSS Selector `&[aria-current=step]`
     */
    _activeStep: string;
    /**
     * Styles to apply when the ARIA attribute `aria-checked` is `mixed`
     * - CSS selector `&[aria-checked=mixed]`
     */
    _indeterminate: string;
    /**
     * Styles to apply when a parent element with `.group`, `data-group` or `role=group` is hovered
     */
    _groupHover: string;
    /**
     * Styles to apply when a sibling element with `.peer` or `data-peer` is hovered
     */
    _peerHover: string;
    /**
     * Styles to apply when a parent element with `.group`, `data-group` or `role=group` is focused
     */
    _groupFocus: string;
    /**
     * Styles to apply when a sibling element with `.peer` or `data-peer` is focused
     */
    _peerFocus: string;
    /**
     * Styles to apply when a parent element with `.group`, `data-group` or `role=group` has visible focus
     */
    _groupFocusVisible: string;
    /**
     * Styles to apply when a sibling element with `.peer`or `data-peer` has visible focus
     */
    _peerFocusVisible: string;
    /**
     * Styles to apply when a parent element with `.group`, `data-group` or `role=group` is active
     */
    _groupActive: string;
    /**
     * Styles to apply when a sibling element with `.peer` or `data-peer` is active
     */
    _peerActive: string;
    /**
     * Styles to apply when a parent element with `.group`, `data-group` or `role=group` is disabled
     */
    _groupDisabled: string;
    /**
     *  Styles to apply when a sibling element with `.peer` or `data-peer` is disabled
     */
    _peerDisabled: string;
    /**
     *  Styles to apply when a parent element with `.group`, `data-group` or `role=group` is invalid
     */
    _groupInvalid: string;
    /**
     *  Styles to apply when a sibling element with `.peer` or `data-peer` is invalid
     */
    _peerInvalid: string;
    /**
     * Styles to apply when a parent element with `.group`, `data-group` or `role=group` is checked
     */
    _groupChecked: string;
    /**
     * Styles to apply when a sibling element with `.peer` or `data-peer` is checked
     */
    _peerChecked: string;
    /**
     *  Styles to apply when a parent element with `.group`, `data-group` or `role=group` has focus within
     */
    _groupFocusWithin: string;
    /**
     *  Styles to apply when a sibling element with `.peer` or `data-peer` has focus within
     */
    _peerFocusWithin: string;
    /**
     * Styles to apply when a sibling element with `.peer` or `data-peer` has placeholder shown
     */
    _peerPlaceholderShown: string;
    /**
     * Styles for CSS Selector `&::placeholder`.
     */
    _placeholder: string;
    /**
     * Styles for CSS Selector `&:placeholder-shown`.
     */
    _placeholderShown: string;
    /**
     * Styles for CSS Selector `&:fullscreen`.
     */
    _fullScreen: string;
    /**
     * Styles for CSS Selector `&::selection`
     */
    _selection: string;
    /**
     * Styles for CSS Selector `[dir=rtl] &`
     * It is applied when a parent element or this element has `dir="rtl"`
     */
    _rtl: string;
    /**
     * Styles for CSS Selector `[dir=ltr] &`
     * It is applied when a parent element or this element has `dir="ltr"`
     */
    _ltr: string;
    /**
     * Styles for CSS Selector `@media (prefers-color-scheme: dark)`
     * It is used when the user has requested the system use a light or dark color theme.
     */
    _mediaDark: string;
    /**
     * Styles for CSS Selector `@media (prefers-reduced-motion: reduce)`
     * It is used when the user has requested the system to reduce the amount of animations.
     */
    _mediaReduceMotion: string;
    /**
     * Styles for when `data-theme` is applied to any parent of
     * this component or element.
     */
    _dark: string;
    /**
     * Styles for when `data-theme` is applied to any parent of
     * this component or element.
     */
    _light: string;
    /**
     * Styles for the CSS Selector `&[data-orientation=horizontal]`
     */
    _horizontal: string;
    /**
     * Styles for the CSS Selector `&[data-orientation=vertical]`
     */
    _vertical: string;
};
type Pseudos = typeof pseudoSelectors;
declare const pseudoPropNames: ("_hover" | "_active" | "_focus" | "_highlighted" | "_focusWithin" | "_focusVisible" | "_disabled" | "_readOnly" | "_before" | "_after" | "_empty" | "_expanded" | "_checked" | "_grabbed" | "_pressed" | "_invalid" | "_valid" | "_loading" | "_selected" | "_hidden" | "_autofill" | "_even" | "_odd" | "_first" | "_firstLetter" | "_last" | "_notFirst" | "_notLast" | "_visited" | "_activeLink" | "_activeStep" | "_indeterminate" | "_groupHover" | "_peerHover" | "_groupFocus" | "_peerFocus" | "_groupFocusVisible" | "_peerFocusVisible" | "_groupActive" | "_peerActive" | "_groupDisabled" | "_peerDisabled" | "_groupInvalid" | "_peerInvalid" | "_groupChecked" | "_peerChecked" | "_groupFocusWithin" | "_peerFocusWithin" | "_peerPlaceholderShown" | "_placeholder" | "_placeholderShown" | "_fullScreen" | "_selection" | "_rtl" | "_ltr" | "_mediaDark" | "_mediaReduceMotion" | "_dark" | "_light" | "_horizontal" | "_vertical")[];

interface StyleProps extends SpaceProps, ColorProps, TransitionProps, TypographyProps, FlexboxProps, TransformProps, GridProps, FilterProps, LayoutProps, BorderProps, EffectProps, BackgroundProps, ListProps, PositionProps, RingProps, ScrollProps, InteractivityProps, TextDecorationProps, OtherProps {
}
interface SystemCSSProperties extends CSS.Properties, Omit<StyleProps, keyof CSS.Properties> {
}
type ThemeThunk<T> = T | ((theme: Record<string, any>) => T);
type PropertyValue<K extends keyof SystemCSSProperties> = ThemeThunk<ResponsiveValue<boolean | number | string | SystemCSSProperties[K]>>;
type CSSWithMultiValues = {
    [K in keyof SystemCSSProperties]?: K extends keyof StyleProps ? StyleProps[K] | PropertyValue<K> : PropertyValue<K>;
};
type PseudoKeys = keyof CSS.Pseudos | keyof Pseudos;
type PseudoSelectorDefinition<D> = D | RecursivePseudo<D>;
type RecursivePseudo<D> = {
    [K in PseudoKeys]?: PseudoSelectorDefinition<D> & D;
};
type CSSDefinition<D> = D | string | RecursiveCSSSelector<D | string>;
interface RecursiveCSSSelector<D> {
    [selector: string]: CSSDefinition<D> & D;
}
type RecursiveCSSObject<D> = D & (D | RecursivePseudo<D> | RecursiveCSSSelector<D>);
type SystemStyleObject = RecursiveCSSObject<CSSWithMultiValues>;
/**
 * @deprecated use `SystemStyleObject` instead
 */
type CSSObject = SystemStyleObject & {};
interface FunctionCSSInterpolation {
    (theme: Record<string, any>): CSSObject;
}
type StyleObjectOrFn = SystemStyleObject | FunctionCSSInterpolation;
type PseudoProps = {
    [K in keyof Pseudos]?: SystemStyleObject;
};
interface SystemProps extends StyleProps, PseudoProps {
}

interface GetCSSOptions {
    theme: CssTheme;
    configs?: Config$1;
    pseudos?: Record<string, CSS.Pseudos | (string & {})>;
}
declare function getCss(options: GetCSSOptions): (stylesOrFn: Record<string, any>, nested?: boolean) => Record<string, any>;
declare const css: (styles: StyleObjectOrFn) => (theme: any) => Record<string, any>;

type Dict<T = any> = {
    [key: string]: T;
};
type StyleFunctionProps = {
    colorScheme: string;
    colorMode: "light" | "dark";
    orientation?: "horizontal" | "vertical";
    theme: Dict;
    [key: string]: any;
};
type SystemStyleFunction = (props: StyleFunctionProps) => SystemStyleObject;
type SystemStyleInterpolation = SystemStyleObject | SystemStyleFunction;
declare function defineStyle<T extends SystemStyleInterpolation>(styles: T): T;
type DefaultProps = {
    size?: string;
    variant?: string;
    colorScheme?: string;
};
type StyleConfig = {
    baseStyle?: SystemStyleInterpolation;
    sizes?: {
        [size: string]: SystemStyleInterpolation;
    };
    variants?: {
        [variant: string]: SystemStyleInterpolation;
    };
    defaultProps?: DefaultProps;
};
/**
 * Defines the style config for a single-part component.
 */
declare function defineStyleConfig<BaseStyle extends SystemStyleInterpolation, Sizes extends Dict<SystemStyleInterpolation>, Variants extends Dict<SystemStyleInterpolation>>(config: {
    baseStyle?: BaseStyle;
    sizes?: Sizes;
    variants?: Variants;
    defaultProps?: {
        size?: keyof Sizes;
        variant?: keyof Variants;
        colorScheme?: string;
    };
}): {
    baseStyle?: BaseStyle | undefined;
    sizes?: Sizes | undefined;
    variants?: Variants | undefined;
    defaultProps?: {
        size?: keyof Sizes | undefined;
        variant?: keyof Variants | undefined;
        colorScheme?: string | undefined;
    } | undefined;
};
type Anatomy = {
    keys: string[];
};
type PartsStyleObject<Parts extends Anatomy = Anatomy> = Partial<Record<Parts["keys"][number], SystemStyleObject>>;
type PartsStyleFunction<Parts extends Anatomy = Anatomy> = (props: StyleFunctionProps) => PartsStyleObject<Parts>;
type PartsStyleInterpolation<Parts extends Anatomy = Anatomy> = PartsStyleObject<Parts> | PartsStyleFunction<Parts>;
interface MultiStyleConfig<Parts extends Anatomy = Anatomy> {
    parts: Parts["keys"];
    baseStyle?: PartsStyleInterpolation<Parts>;
    sizes?: {
        [size: string]: PartsStyleInterpolation<Parts>;
    };
    variants?: {
        [variant: string]: PartsStyleInterpolation<Parts>;
    };
    defaultProps?: DefaultProps;
}
/**
 * Returns an object of helpers that can be used to define
 * the style configuration for a multi-part component.
 */
declare function createMultiStyleConfigHelpers<Part extends string>(parts: Part[] | Readonly<Part[]>): {
    definePartsStyle<PartStyles extends PartsStyleInterpolation<{
        keys: Part[];
    }>>(config: PartStyles): PartStyles;
    defineMultiStyleConfig<BaseStyle extends PartsStyleInterpolation<{
        keys: Part[];
    }>, Sizes extends Dict<PartsStyleInterpolation<{
        keys: Part[];
    }>>, Variants extends Dict<PartsStyleInterpolation<{
        keys: Part[];
    }>>>(config: {
        baseStyle?: BaseStyle | undefined;
        sizes?: Sizes | undefined;
        variants?: Variants | undefined;
        defaultProps?: {
            size?: keyof Sizes | undefined;
            variant?: keyof Variants | undefined;
            colorScheme?: string | undefined;
        } | undefined;
    }): {
        baseStyle?: BaseStyle | undefined;
        sizes?: Sizes | undefined;
        variants?: Variants | undefined;
        defaultProps?: {
            size?: keyof Sizes | undefined;
            variant?: keyof Variants | undefined;
            colorScheme?: string | undefined;
        } | undefined;
        parts: Part[];
    };
};

type Theme = WithCSSVar<Record<string, any>>;
type Config = {
    parts?: string[];
    baseStyle?: Record<string, any>;
    variants?: Record<string, any>;
    sizes?: Record<string, any>;
};
type ValueType = ResponsiveValue<string | boolean>;
type Values = {
    theme: Theme;
    variant?: ValueType;
    size?: ValueType;
};
declare function resolveStyleConfig(config: Config): (props: Values) => any;

declare const systemProps: any;
declare const layoutPropNames: (string | number | symbol)[];
declare const propNames: string[];
declare const isStyleProp: (prop: string) => boolean;

declare const tokenToCSSVar: (scale: ThemeScale, value: any) => (theme: Record<string, any>) => any;

/**
 * Get the CSS variable ref stored in the theme
 */
declare function getCSSVar(theme: Record<string, any>, scale: string, value: any): any;

interface ThemingProps<ThemeComponent extends string = any> {
    variant?: ResponsiveValue<ThemeComponent extends keyof ThemeTypings["components"] ? ThemeTypings["components"][ThemeComponent]["variants"] : string>;
    size?: ResponsiveValue<ThemeComponent extends keyof ThemeTypings["components"] ? ThemeTypings["components"][ThemeComponent]["sizes"] : string>;
    colorScheme?: ThemeTypings["colorSchemes"];
    orientation?: "vertical" | "horizontal";
    styleConfig?: Record<string, any>;
}
declare function omitThemingProps<T extends ThemingProps>(props: T): Omit<T, "colorScheme" | "size" | "variant" | "styleConfig">;

type OmitSpaceXY<T> = Omit<T, "spaceX" | "spaceY">;

export { BackgroundProps, BorderProps, CSSObject, CSSWithMultiValues, ColorProps, CustomThemeTypings, EffectProps, FilterProps, FlatToken, FlatTokens, FlattenTokensParam, FlexboxProps, FunctionCSSInterpolation, GridProps, InteractivityProps, LayoutProps, ListProps, MultiStyleConfig, OmitSpaceXY, Operand, OtherProps, PartsStyleFunction, PartsStyleInterpolation, PartsStyleObject, PlainToken, PositionProps, Pseudos, RecursiveCSSObject, RecursiveCSSSelector, RecursivePseudo, ResponsiveArray, ResponsiveObject, ResponsiveValue, RingProps, ScrollProps, SemanticToken, SemanticValue, SpaceProps, StyleConfig, StyleFunctionProps, StyleObjectOrFn, StyleProps, SystemCSSProperties, SystemProps, SystemStyleFunction, SystemStyleInterpolation, SystemStyleObject, TextDecorationProps, ThemeScale, ThemeThunk, ThemeTypings, ThemingProps, TransformProps, TransitionProps, TypographyProps, WithCSSVar, addPrefix, background, border, calc, color, createMultiStyleConfigHelpers, css, cssVar, defineCssVars, defineStyle, defineStyleConfig, effect, filter, flattenTokens, flexbox, getCSSVar, getCss, grid, interactivity, isStyleProp, layout, layoutPropNames, list, omitThemingProps, others, position, propNames, pseudoPropNames, pseudoSelectors, resolveStyleConfig, ring, scroll, space, systemProps, textDecoration, toCSSVar, toVarDefinition, toVarReference, tokenToCSSVar, transform, transition, typography };
