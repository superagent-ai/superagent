import * as _chakra_ui_system from '@chakra-ui/system';
import { SystemStyleObject, ThemingProps, HTMLChakraProps } from '@chakra-ui/system';
import * as react from 'react';
import { UseSliderProps, UseSliderReturn } from './use-slider.js';
import '@chakra-ui/react-types';

interface SliderContext extends Omit<UseSliderReturn, "getInputProps" | "getRootProps"> {
}
declare const SliderProvider: react.Provider<SliderContext>;
declare const useSliderContext: () => SliderContext;
declare const useSliderStyles: () => Record<string, SystemStyleObject>;

interface SliderProps extends UseSliderProps, ThemingProps<"Slider">, Omit<HTMLChakraProps<"div">, keyof UseSliderProps> {
}
/**
 * The Slider is used to allow users to make selections from a range of values.
 * It provides context and functionality for all slider components
 *
 * @see Docs     https://chakra-ui.com/docs/form/slider
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/slider/
 */
declare const Slider: _chakra_ui_system.ComponentWithAs<"div", SliderProps>;
interface SliderThumbProps extends HTMLChakraProps<"div"> {
}
/**
 * Slider component that acts as the handle used to select predefined
 * values by dragging its handle along the track
 */
declare const SliderThumb: _chakra_ui_system.ComponentWithAs<"div", SliderThumbProps>;
interface SliderTrackProps extends HTMLChakraProps<"div"> {
}
declare const SliderTrack: _chakra_ui_system.ComponentWithAs<"div", SliderTrackProps>;
interface SliderInnerTrackProps extends HTMLChakraProps<"div"> {
}
declare const SliderFilledTrack: _chakra_ui_system.ComponentWithAs<"div", SliderInnerTrackProps>;
interface SliderMarkProps extends HTMLChakraProps<"div"> {
    value: number;
}
/**
 * SliderMark is used to provide names for specific Slider
 * values by defining labels or markers along the track.
 *
 * @see Docs https://chakra-ui.com/slider
 */
declare const SliderMark: _chakra_ui_system.ComponentWithAs<"div", SliderMarkProps>;

export { Slider, SliderFilledTrack, SliderInnerTrackProps, SliderMark, SliderMarkProps, SliderProps, SliderProvider, SliderThumb, SliderThumbProps, SliderTrack, SliderTrackProps, useSliderContext, useSliderStyles };
