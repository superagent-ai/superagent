import camelCaseProperty from './camelCaseProperty';
import unprefixProperty from './unprefixProperty';
export default function normalizeProperty(property) {
  return unprefixProperty(camelCaseProperty(property));
}