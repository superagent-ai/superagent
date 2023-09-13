import capitalizeString from './capitalizeString';

export default function prefixProperty(prefixProperties, property, style) {
  var requiredPrefixes = prefixProperties[property];

  if (requiredPrefixes && style.hasOwnProperty(property)) {
    var capitalizedProperty = capitalizeString(property);

    for (var i = 0; i < requiredPrefixes.length; ++i) {
      var prefixedProperty = requiredPrefixes[i] + capitalizedProperty;

      if (!style[prefixedProperty]) {
        style[prefixedProperty] = style[property];
      }
    }
  }

  return style;
}