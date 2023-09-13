import hyphenateProperty from './hyphenateProperty';
export default function resolveArrayValue(property, value) {
  return value.join(';' + hyphenateProperty(property) + ':');
}