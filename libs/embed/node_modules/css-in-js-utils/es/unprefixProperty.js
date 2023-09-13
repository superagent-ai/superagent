var RE = /^(ms|Webkit|Moz|O)/;
export default function unprefixProperty(property) {
  var propertyWithoutPrefix = property.replace(RE, '');
  return propertyWithoutPrefix.charAt(0).toLowerCase() + propertyWithoutPrefix.slice(1);
}