import * as CSS from 'csstype';
import {NanoRenderer} from '../types/nano';

type TLength = string | number;

export interface EmmetAddon {
    // Visual Formatting; //
    /**
     * Short for `position` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    pos?: CSS.Property.Position;
    /**
     * Short for `top` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    t?: CSS.Property.Top<TLength>;
    /**
     * Short for `right` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    r?: CSS.Property.Right<TLength>;
    /**
     * Short for `bottom` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    b?: CSS.Property.Bottom<TLength>;
    /**
     * Short for `left` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    l?: CSS.Property.Left<TLength>;
    /**
     * Short for `z-index` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    z?: CSS.Property.ZIndex;
    /**
     * Short for `float` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    fl?: CSS.Property.Float;
    /**
     * Short for `clear` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    cl?: CSS.Property.Clear;
    /**
     * Short for `display` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    d?: CSS.Property.Display;
    /**
     * Short for `visibility` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    v?: CSS.Property.Visibility;
    /**
     * Short for `overflow` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    ov?: CSS.Property.Overflow;
    /**
     * Short for `overflow-x` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    ovx?: CSS.Property.OverflowX;
    /**
     * Short for `overflow-y` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    ovy?: CSS.Property.OverflowY;
    /**
     * Short for `overflow-style` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    ovs?: CSS.Property.MsOverflowStyle;
    /**
     * Short for `zoom` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    zm?: CSS.Property.Zoom;
    /**
     * Short for `clip` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    cp?: CSS.Property.Clip;
    /**
     * Short for `resize` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    rsz?: CSS.Property.Resize;
    /**
     * Short for `cursor` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    cur?: CSS.Property.Cursor;
    // Margin & Padding; //
    /**
     * Short for `margin` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    m?: CSS.Property.Margin<TLength>;
    /**
     * Short for `margin-top` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    mt?: CSS.Property.MarginTop<TLength>;
    /**
     * Short for `margin-right` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    mr?: CSS.Property.MarginRight<TLength>;
    /**
     * Short for `margin-bottom` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    mb?: CSS.Property.MarginBottom<TLength>;
    /**
     * Short for `margin-left` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    ml?: CSS.Property.MarginLeft<TLength>;
    /**
     * Short for `padding` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    p?: CSS.Property.Padding<TLength>;
    /**
     * Short for `paddin-top` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    pt?: CSS.Property.PaddingTop<TLength>;
    /**
     * Short for `padding-right` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    pr?: CSS.Property.PaddingRight<TLength>;
    /**
     * Short for `padding-bottom` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    pb?: CSS.Property.PaddingBottom<TLength>;
    /**
     * Short for `padding-left` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    pl?: CSS.Property.PaddingLeft<TLength>;
    // Box Sizing; //
    /**
     * Short for `box-sizing` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bxz?: CSS.Property.BoxSizing;
    /**
     * Short for `box-shadow` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bxsh?: CSS.Property.BoxShadow;
    /**
     * Short for `width` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    w?: CSS.Property.Width<TLength>;
    /**
     * Short for `height` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    h?: CSS.Property.Height<TLength>;
    /**
     * Short for `max-width` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    maw?: CSS.Property.MaxWidth<TLength>;
    /**
     * Short for `max-height` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    mah?: CSS.Property.MaxHeight<TLength>;
    /**
     * Short for `min-width` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    miw?: CSS.Property.MinWidth<TLength>;
    /**
     * Short for `min-height` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    mih?: CSS.Property.MinHeight<TLength>;
    // Font; //
    /**
     * Short for `font` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    f?: CSS.Property.Font;
    /**
     * Short for `font-weight` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    fw?: CSS.Property.FontWeight;
    /**
     * Short for `font-style` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    fs?: CSS.Property.FontStyle;
    /**
     * Short for `font-variant` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    fv?: CSS.Property.FontVariant;
    /**
     * Short for `font-size` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    fz?: CSS.Property.FontSize<TLength>;
    /**
     * Short for `font-family` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    ff?: CSS.Property.FontFamily;
    /**
     * Short for `font-stretch` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    fst?: CSS.Property.FontStretch;

    // Text; //
    /**
     * Short for `vertical-align` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    va?: CSS.Property.VerticalAlign<TLength>;
    /**
     * Short for `text-align` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    ta?: CSS.Property.TextAlign;
    /**
     * Short for `text-decoration` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    td?: CSS.Property.TextDecoration<TLength>;
    /**
     * Short for `text-emphasis` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    te?: CSS.Property.TextEmphasis;
    /**
     * Short for `text-indent` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    ti?: CSS.Property.TextIndent<TLength>;
    /**
     * Short for `text-justify` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    tj?: CSS.Property.TextJustify;
    /**
     * Short for `text-transform` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    tt?: CSS.Property.TextTransform;
    /**
     * Short for `text-shadow` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    tsh?: CSS.Property.TextShadow;
    /**
     * Short for `line-height` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    lh?: CSS.Property.LineHeight<TLength>;
    /**
     * Short for `letter-spacing` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    lts?: CSS.Property.LetterSpacing<TLength>;
    /**
     * Short for `white-space` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    whs?: CSS.Property.WhiteSpace;
    /**
     * Short for `word-break` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    wob?: CSS.Property.WordBreak;
    /**
     * Short for `word-spacing` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    wos?: CSS.Property.WordSpacing<TLength>;
    /**
     * Short for `word-wrap` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    wow?: CSS.Property.WordWrap;
    // Background; //
    /**
     * Short for `background` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bg?: CSS.Property.Background<TLength>;
    /**
     * Short for `background-color` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bgc?: CSS.Property.BackgroundColor;
    /**
     * Short for `background-image` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bgi?: CSS.Property.BackgroundImage;
    /**
     * Short for `background-repeat` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bgr?: CSS.Property.BackgroundRepeat;
    /**
     * Short for `background-attachment` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bga?: CSS.Property.BackgroundAttachment;
    /**
     * Short for `background-position` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bgp?: CSS.Property.BackgroundPosition<TLength>;
    /**
     * Short for `background-position-x` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bgpx?: CSS.Property.BackgroundPositionX<TLength>;
    /**
     * Short for `background-position-y` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bgpy?: CSS.Property.BackgroundPositionY<TLength>;
    /**
     * Short for `background-clip` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bgcp?: CSS.Property.BackgroundClip;
    /**
     * Short for `background-origin` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bgo?: CSS.Property.BackgroundOrigin;
    /**
     * Short for `background-size` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bgsz?: CSS.Property.BackgroundSize<TLength>;
    // Color; //
    /**
     * Short for `color` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    c?: CSS.Property.Color;
    /**
     * Short for `opacity` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    op?: CSS.Globals | number;
    // Generated Content; //
    /**
     * Short for `content` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    ct?: CSS.Property.Content;
    /**
     * Short for `quotes` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    q?: CSS.Property.Quotes;
    /**
     * Short for `counter-increment` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    coi?: CSS.Property.CounterIncrement;
    /**
     * Short for `counter-reset` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    cor?: CSS.Property.CounterReset;
    // Outline; //
    /**
     * Short for `outline` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    ol?: CSS.Property.Outline<TLength>;
    /**
     * Short for `outline-offset` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    olo?: CSS.Property.OutlineOffset<TLength>;
    /**
     * Short for `outline-width` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    olw?: CSS.Property.OutlineWidth<TLength>;
    /**
     * Short for `outline-style` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    ols?: CSS.Property.OutlineStyle;
    /**
     * Short for `outline-color` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    olc?: CSS.Property.OutlineColor;
    // Tables; //
    /**
     * Short for `table-layout` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    tbl?: CSS.Property.TableLayout;
    /**
     * Short for `caption-side` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    cps?: CSS.Property.CaptionSide;
    /**
     * Short for `empty-cells` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    ec?: CSS.Property.EmptyCells;
    // Border;
    /**
     * Short for `border` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bd?: CSS.Property.Border<TLength>;
    /**
     * Short for `position` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdcl?: CSS.Property.BorderCollapse;
    /**
     * Short for `position` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdc?: CSS.Property.BorderColor;
    /**
     * Short for `position` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdi?: CSS.Property.BorderImage;
    /**
     * Short for `border-style` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bds?: CSS.Property.BorderStyle;
    /**
     * Short for `border-width` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdw?: CSS.Property.BorderWidth<TLength>;
    /**
     * Short for `border-top` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdt?: CSS.Property.BorderTop<TLength>;
    /**
     * Short for `border-top-width` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdtw?: CSS.Property.BorderTopWidth<TLength>;
    /**
     * Short for `border-top-style` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdts?: CSS.Property.BorderTopStyle;
    /**
     * Short for `border-top-color` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdtc?: CSS.Property.BorderTopColor;
    /**
     * Short for `border-right` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdr?: CSS.Property.BorderRight<TLength>;
    /**
     * Short for `border-right-width` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdrw?: CSS.Property.BorderRightWidth<TLength>;
    /**
     * Short for `border-right-style` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdrst?: CSS.Property.BorderRightStyle;
    /**
     * Short for `border-right-color` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdrc?: CSS.Property.BorderRightColor;
    /**
     * Short for `border-bottom` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdb?: CSS.Property.BorderBottom<TLength>;
    /**
     * Short for `border-bottom-width` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdbw?: CSS.Property.BorderBottomWidth<TLength>;
    /**
     * Short for `border-bottom-style` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdbs?: CSS.Property.BorderBottomStyle;
    /**
     * Short for `border-bottom-color` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdbc?: CSS.Property.BorderBottomColor;
    /**
     * Short for `border-left` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdl?: CSS.Property.BorderLeft<TLength>;
    /**
     * Short for `border-left-width` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdlw?: CSS.Property.BorderLeftWidth<TLength>;
    /**
     * Short for `border-left-style` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdls?: CSS.Property.BorderLeftStyle;
    /**
     * Short for `border-left-color` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdlc?: CSS.Property.BorderLeftColor;
    /**
     * Short for `border-radius` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdrs?: CSS.Property.BorderRadius<TLength>;
    /**
     * Short for `border-top-left-radius` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdtlrs?: CSS.Property.BorderTopLeftRadius<TLength>;
    /**
     * Short for `border-top-right-radius` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdtrrs?: CSS.Property.BorderTopRightRadius<TLength>;
    /**
     * Short for `border-bottom-right-radius` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdbrrs?: CSS.Property.BorderBottomRightRadius<TLength>;
    /**
     * Short for `border-bottom-left-radius` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdblrs?: CSS.Property.BorderBottomLeftRadius<TLength>;
    // Lists; //
    /**
     * Short for `list-style` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    lis?: CSS.Property.ListStyle;
    /**
     * Short for `list-style-position` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    lisp?: CSS.Property.ListStylePosition;
    /**
     * Short for `list-style-type` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    list?: CSS.Property.ListStyleType;
    /**
     * Short for `list-style-image` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    lisi?: CSS.Property.ListStyleImage;
    // Flexbox Parent/Child Properties; //
    /**
     * Short for `align-content` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    ac?: CSS.Property.AlignContent;
    /**
     * Short for `align-items` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    ai?: CSS.Property.AlignItems;
    /**
     * Short for `align-self` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    as?: CSS.Property.AlignSelf;
    /**
     * Short for `justify-content` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    jc?: CSS.Property.JustifyContent;
    /**
     * Short for `flex` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    fx?: CSS.Property.Flex<TLength>;
    /**
     * Short for `flex-basis` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    fxb?: CSS.Property.FlexBasis<TLength>;
    /**
     * Short for `flex-direction` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    fxd?: CSS.Property.FlexDirection;
    /**
     * Short for `flex-flow` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    fxf?: CSS.Property.FlexFlow;
    /**
     * Short for `flex-grow` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    fxg?: CSS.Globals | number;
    /**
     * Short for `position` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    fxs?: CSS.Globals | number;
    /**
     * Short for `flex-wrap` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    fxw?: CSS.Property.FlexWrap;
    /**
     * Short for `order` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    ord?: CSS.Globals | number;
    // CSS Grid Layout; //
    /**
     * Short for `columns` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    colm?: CSS.Property.Columns<TLength>;
    /**
     * Short for `column-count` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    colmc?: CSS.Property.ColumnCount;
    /**
     * Short for `column-fill` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    colmf?: CSS.Property.ColumnFill;
    /**
     * Short for `column-gap` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    colmg?: CSS.Property.ColumnGap<TLength>;
    /**
     * Short for `column-rule` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    colmr?: CSS.Property.ColumnRule<TLength>;
    /**
     * Short for `column-rule-color` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    colmrc?: CSS.Property.ColumnRuleColor;
    /**
     * Short for `column-rule-style` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    colmrs?: CSS.Property.ColumnRuleStyle;
    /**
     * Short for `column-rule-width` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    colmrw?: CSS.Property.ColumnRuleWidth<TLength>;
    /**
     * Short for `column-span` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    colms?: CSS.Property.ColumnSpan;
    /**
     * Short for `column-width` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    colmw?: CSS.Property.ColumnWidth<TLength>;
    // CSS Transitions; //
    /**
     * Short for `transform` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    trf?: CSS.Property.Transform;
    /**
     * Short for `transform-origin` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    trfo?: CSS.Property.TransformOrigin<TLength>;
    /**
     * Short for `transform-style` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    trfs?: CSS.Property.TransformStyle;
    /**
     * Short for `transition` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    trs?: CSS.Property.Transition;
    /**
     * Short for `transition-delay` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    trsde?: CSS.Globals | number;
    /**
     * Short for `transition-duration` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    trsdu?: CSS.Globals | number;
    /**
     * Short for `transition-property` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    trsp?: CSS.Property.TransitionProperty;
    /**
     * Short for `transition-timing-function` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    trstf?: CSS.Property.TransitionTimingFunction;
    // Others; //
    /**
     * Short for `backface-visibility` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bfv?: CSS.Property.BackfaceVisibility;
    /**
     * Short for `text-overflow` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    tov?: CSS.Property.TextOverflow;
    /**
     * Short for `orientation` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    ori?: CSS.AtRule.Orientation;
    /**
     * Short for `user-select` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    us?: CSS.Property.UserSelect;
}

export function addon(nano: NanoRenderer);
