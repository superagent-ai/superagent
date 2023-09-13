/**
 * Converts a value to a specific precision (or decimal points).
 *
 * Returns a string representing a number in fixed-point notation.
 *
 * @param value the value to convert
 * @param precision the precision or decimal points
 */
declare function toPrecision(value: number, precision?: number): string;
/**
 * Counts the number of decimal places a number has
 *
 * @param value the decimal value to count
 */
declare function countDecimalPlaces(value: number): number;
/**
 * Convert a value to percentage based on lower and upper bound values
 *
 * @param value the value in number
 * @param min the minimum value
 * @param max the maximum value
 */
declare function valueToPercent(value: number, min: number, max: number): number;
/**
 * Calculate the value based on percentage, lower and upper bound values
 *
 * @param percent the percent value in decimals (e.g 0.6, 0.3)
 * @param min the minimum value
 * @param max the maximum value
 */
declare function percentToValue(percent: number, min: number, max: number): number;
/**
 * Rounds a specific value to the next or previous step
 *
 * @param value the value to round
 * @param from the number that stepping started from
 * @param step the specified step
 */
declare function roundValueToStep(value: number, from: number, step: number): string;
/**
 * Clamps a value to ensure it stays within the min and max range.
 *
 * @param value the value to clamp
 * @param min the minimum value
 * @param max the maximum value
 */
declare function clampValue(value: number, min: number, max: number): number;

export { clampValue, countDecimalPlaces, percentToValue, roundValueToStep, toPrecision, valueToPercent };
