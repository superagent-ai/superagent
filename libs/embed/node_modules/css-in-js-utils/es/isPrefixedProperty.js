var RE = /^(Webkit|Moz|O|ms)/;
export default function isPrefixedProperty(property) {
  return RE.test(property);
}