var RE = /-webkit-|-moz-|-ms-/;
export default function isPrefixedValue(value) {
  return typeof value === 'string' && RE.test(value);
}