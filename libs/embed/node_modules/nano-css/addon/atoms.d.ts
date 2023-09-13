import * as CSS from 'csstype';
import {NanoRenderer} from '../types/nano';

type TLength = string | number;

export interface Atoms {
    /**
     * Short for `display` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    d?: CSS.Property.Display;

    /**
     * Short for `margin` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    mar?: CSS.Property.Margin<TLength>;

    /**
     * Short for `margin-top` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    mart?: CSS.Property.MarginBottom<TLength>;

    /**
     * Short for `margin-right` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    marr?: CSS.Property.MarginBottom<TLength>;

    /**
     * Short for `margin-bottom` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    marb?: CSS.Property.MarginBottom<TLength>;

    /**
     * Short for `margin-left` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    marl?: CSS.Property.MarginBottom<TLength>;

    /**
     * Short for `padding` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    pad?: CSS.Property.Padding<TLength>;

    /**
     * Short for `padding-top` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    padt?: CSS.Property.PaddingBottom<TLength>;

    /**
     * Short for `padding-right` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    padr?: CSS.Property.PaddingBottom<TLength>;

    /**
     * Short for `padding-bottom` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    padb?: CSS.Property.PaddingBottom<TLength>;

    /**
     * Short for `padding-left` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    padl?: CSS.Property.PaddingBottom<TLength>;

    /**
     * Short for `border` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bd?: CSS.Property.BorderBottom<TLength>;

    /**
     * Short for `border-top` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdt?: CSS.Property.BorderBottom<TLength>;

    /**
     * Short for `border-right` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdr?: CSS.Property.BorderBottom<TLength>;

    /**
     * Short for `border-bottom` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdb?: CSS.Property.BorderBottom<TLength>;

    /**
     * Short for `border-left` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdl?: CSS.Property.BorderBottom<TLength>;

    /**
     * Short for `border-radius` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bdrad?: CSS.Property.BorderRadius<TLength>;

    /**
     * Short for `color` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    col?: CSS.Property.Color;

    /**
     * Short for `opacity` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    op?: number | string;

    /**
     * Short for `background` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bg?: CSS.Property.Background<TLength>;

    /**
     * Short for `background-color` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bgc?: CSS.Property.BackgroundColor;

    /**
     * Short for `font-size` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    fz?: CSS.Property.FontSize<TLength>;

    /**
     * Short for `font-style` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    fs?: CSS.Property.FontStyle;

    /**
     * Short for `font-weight` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    fw?: CSS.Property.FontWeight;

    /**
     * Short for `font-family` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    ff?: CSS.Property.FontFamily;

    /**
     * Short for `line-height` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    lh?: CSS.Property.LineHeight<TLength>;

    /**
     * Short for `box-sizing` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    bxz?: CSS.Property.BoxSizing;

    /**
     * Short for `cursor` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    cur?: CSS.Property.Cursor;

    /**
     * Short for `overflow` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    ov?: CSS.Property.Overflow;

    /**
     * Short for `position` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    pos?: CSS.Property.Position;

    /**
     * Short for `list-style` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    ls?: CSS.Property.ListStyle;

    /**
     * Short for `text-align` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    ta?: CSS.Property.TextAlign;

    /**
     * Short for `text-decoration` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    td?: CSS.Property.TextDecoration<TLength>;

    /**
     * Short for `float` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    fl?: CSS.Property.Float;

    /**
     * Short for `width` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    w?: CSS.Property.Width<TLength>;

    /**
     * Short for `min-width` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    minW?: CSS.Property.MinWidth<TLength>;

    /**
     * Short for `max-width` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    maxW?: CSS.Property.MaxWidth<TLength>;

    /**
     * Short for `min-height` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    minH?: CSS.Property.MinHeight<TLength>;

    /**
     * Short for `max-height` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    maxH?: CSS.Property.MaxHeight<TLength>;

    /**
     * Short for `height` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    h?: CSS.Property.Height<TLength>;

    /**
     * Short for `transition` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    trs?: CSS.Property.Transition;

    /**
     * Short for `outline` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    out?: CSS.Property.Outline<TLength>;

    /**
     * Short for `visibility` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    vis?: CSS.Property.Visibility;

    /**
     * Short for `word-wrap` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    ww?: CSS.Property.WordWrap;

    /**
     * Short for `content` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    con?: CSS.Property.Content;

    /**
     * Short for `z-index` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    z?: CSS.Property.ZIndex;

    /**
     * Short for `transform` property. Requires [`atoms` addon](https://github.com/streamich/nano-css/blob/master/docs/atoms.md).
     */
    tr?: CSS.Property.Transform;
}

export function addon(nano: NanoRenderer);
