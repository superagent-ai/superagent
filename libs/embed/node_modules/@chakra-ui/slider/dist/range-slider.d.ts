import * as _chakra_ui_system from '@chakra-ui/system';
import { SystemStyleObject, ThemingProps, HTMLChakraProps } from '@chakra-ui/system';
import * as react from 'react';
import { UseRangeSliderProps, UseRangeSliderReturn } from './use-range-slider.js';
import '@chakra-ui/react-types';

interface RangeSliderContext extends Omit<UseRangeSliderReturn, "getRootProps"> {
    name?: string | string[];
}
declare const RangeSliderProvider: react.Provider<RangeSliderContext>;
declare const useRangeSliderContext: () => RangeSliderContext;
declare const useRangeSliderStyles: () => Record<string, SystemStyleObject>;

interface RangeSliderProps extends UseRangeSliderProps, ThemingProps<"Slider">, Omit<HTMLChakraProps<"div">, keyof UseRangeSliderProps> {
}
/**
 * The Slider is used to allow users to make selections from a range of values.
 * It provides context and functionality for all slider components
 *
 * @see Docs     https://chakra-ui.com/docs/form/slider
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/slidertwothumb/
 */
declare const RangeSlider: _chakra_ui_system.ComponentWithAs<"div", RangeSliderProps>;
interface RangeSliderThumbProps extends HTMLChakraProps<"div"> {
    index: number;
}
/**
 * Slider component that acts as the handle used to select predefined
 * values by dragging its handle along the track
 */
declare const RangeSliderThumb: _chakra_ui_system.ComponentWithAs<"div", RangeSliderThumbProps>;
interface RangeSliderTrackProps extends HTMLChakraProps<"div"> {
}
declare const RangeSliderTrack: _chakra_ui_system.ComponentWithAs<"div", RangeSliderTrackProps>;
interface RangeSliderInnerTrackProps extends HTMLChakraProps<"div"> {
}
declare const RangeSliderFilledTrack: _chakra_ui_system.ComponentWithAs<"div", RangeSliderInnerTrackProps>;
interface RangeSliderMarkProps extends HTMLChakraProps<"div"> {
    value: number;
}
/**
 * SliderMark is used to provide names for specific Slider
 * values by defining labels or markers along the track.
 *
 * @see Docs https://chakra-ui.com/slider
 */
declare const RangeSliderMark: _chakra_ui_system.ComponentWithAs<"div", RangeSliderMarkProps>;

export { RangeSlider, RangeSliderFilledTrack, RangeSliderInnerTrackProps, RangeSliderMark, RangeSliderMarkProps, RangeSliderProps, RangeSliderProvider, RangeSliderThumb, RangeSliderThumbProps, RangeSliderTrack, RangeSliderTrackProps, useRangeSliderContext, useRangeSliderStyles };
