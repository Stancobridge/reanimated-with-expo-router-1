// css-to-reanimated.ts

import { EasingFunction } from 'react-native';
import Animated, { Easing, withTiming } from 'react-native-reanimated';
// A function that parses a keyframe string and returns an object with the percentage and the values
function parseKeyframe(keyframe: string) {
  // A regex to match the percentage and the values
  const regex = /(\d+)%\s*\{([\s\S]+?)\}/;
  const match = keyframe.match(regex);
  if (!match) {
    throw new Error('Invalid keyframe');
  }
  const percentage = parseInt(match[1], 10);
  const values = match[2];

  // A function that parses a value string and returns an object with the property and the value
  function parseValue(paramValue: string) {
    // A regex to match the property and the value
    const regex = /(\w+)\s*:\s*([\w.-]+)/;
    const match = paramValue.match(regex);
    if (!match) {
      throw new Error('Invalid value');
    }
    const property = match[1];
    const value = match[2];

    // A function that converts a CSS value to a Reanimated value
    function convertValue(value: string) {
      // If the value is a number, return it as a number
      if (/^\d+$/.test(value)) {
        return parseInt(value, 10);
      }
      // If the value is a percentage, return it as a fraction of 100
      if (/%$/.test(value)) {
        return parseInt(value, 10) / 100;
      }
      // If the value is a color, return it as an array of RGB values
      if (/^#/.test(value)) {
        return [parseInt(value.slice(1, 3), 16), parseInt(value.slice(3, 5), 16), parseInt(value.slice(5, 7), 16)];
      }
      // Otherwise, throw an error
      throw new Error('Unsupported value');
    }

    return { property, value: convertValue(value) };
  }

  // Split the values by semicolons and map them to objects
  const valuesArray = values.split(';').map(parseValue);

  return { percentage, values: valuesArray };
}
// A function that parses a CSS @keyframes animation string and returns an object with the keyframes and the properties
function parseCSSAnimation(css: string) {
  // A regex to match the @keyframes rule and capture the name, the keyframes and the properties
  const regex = /@keyframes\s+(\w+)\s*\{([\s\S]+?)\}\s*([\s\S]*)/;
  const match = css.match(regex);
  if (!match) {
    throw new Error('Invalid CSS animation');
  }
  const name = match[1];
  const keyframes = match[2];
  const properties = match[3];

  // Split the keyframes by newlines and map them to objects
  const keyframesArray = keyframes.split('\n').map(parseKeyframe);

  // Parse the properties string and return an object with the duration and the easing
  function parseProperties(properties: string) {
    // A regex to match the duration and the easing
    const regex = /animation-duration:\s*(\d+)s;\s*animation-timing-function:\s*(\w+);/;
    const match = properties.match(regex);
    if (!match) {
      throw new Error('Invalid properties');
    }
    const duration = parseInt(match[1], 10) * 1000; // Convert seconds to milliseconds
    const easing = match[2];

    // A function that converts a CSS easing to a Reanimated easing
    function convertEasing(easing: string) {
      // A map of CSS easings to Reanimated easings
      const easingsMap: Record<string, EasingFunction> = {
        linear: Easing.linear,
        ease: Easing.ease,
        easeIn: Easing.in as any,
        easeOut: Easing.out as any,
        easeInOut: Easing.inOut as any,
      };
      // Return the corresponding Reanimated easing or throw an error
      return (
        easingsMap[easing] ||
        (() => {
          throw new Error('Unsupported easing');
        })
      );
    }

    return { duration, easing: convertEasing(easing) };
  }

  const { duration, easing } = parseProperties(properties);

  return { name, keyframes: keyframesArray, duration, easing };
}

// A function that converts a parsed CSS animation object to a Reanimated animation object
function convertToReanimatedAnimation(cssAnimation: ReturnType<typeof parseCSSAnimation>) {
  const { name, keyframes, duration, easing } = cssAnimation;

  // A function that interpolates a value between two keyframes
  function interpolateValue(
    progress: Animated.SharedValue<number>,
    fromKeyframe: ReturnType<typeof parseKeyframe>,
    toKeyframe: ReturnType<typeof parseKeyframe>,
    property: string,
  ) {
    // Find the value for the property in the from and to keyframes
    const fromValue = fromKeyframe.values.find((value) => value.property === property)?.value;
    const toValue = toKeyframe.values.find((value) => value.property === property)?.value;
    // If the values are not found, return undefined
    if (fromValue === undefined || toValue === undefined) {
      return undefined;
    }
    // If the values are numbers, interpolate them linearly
    if (typeof fromValue === 'number' && typeof toValue === 'number') {
      return progress.value * (toValue - fromValue) + fromValue;
    }
    // If the values are arrays, interpolate them element-wise
    if (Array.isArray(fromValue) && Array.isArray(toValue)) {
      return fromValue.map((v, i) => progress.value * (toValue[i] - v) + v);
    }
    // Otherwise, throw an error
    throw new Error('Unsupported value');
  }

  // A function that creates a Reanimated style object for a given progress
  function createStyle(progress: Animated.SharedValue<number>) {
    // Initialize an empty style object
    const style: any = {};
    // Loop through the keyframes and find the current interval
    for (let i = 0; i < keyframes.length - 1; i++) {
      const fromKeyframe = keyframes[i];
      const toKeyframe = keyframes[i + 1];
      // If the progress is within the interval, interpolate the values for each property
      if (progress.value >= fromKeyframe.percentage / 100 && progress.value <= toKeyframe.percentage / 100) {
        // A list of supported properties
        const properties = ['opacity', 'transform', 'backgroundColor', 'width', 'height'];
        // Loop through the properties and assign the interpolated values to the style object
        for (const property of properties) {
          const value = interpolateValue(progress, fromKeyframe, toKeyframe, property);
          if (value !== undefined) {
            style[property] = value;
          }
        }
        // Break the loop as we found the interval
        break;
      }
    }
    // Return the style object
    return style;
  }

  // A function that returns a Reanimated animation function for a given progress
  function createAnimation(progress: Animated.SharedValue<number>) {
    return withTiming(1, { duration, easing }, () => {
      // Reset the progress to zero after the animation ends
      progress.value = 0;
    });
  }

  // Return an object with the name, the style and the animation functions
  return { name, style: createStyle, animation: createAnimation };
}

// Export a function that takes a CSS @keyframes animation string and returns a Reanimated animation object
export default function cssToReanimated(css: string) {
  const cssAnimation = parseCSSAnimation(css);
  const reanimatedAnimation = convertToReanimatedAnimation(cssAnimation);
  return reanimatedAnimation;
}
