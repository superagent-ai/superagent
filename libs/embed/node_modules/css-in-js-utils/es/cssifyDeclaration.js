import hyphenateProperty from './hyphenateProperty';
export default function cssifyDeclaration(property, value) {
  return hyphenateProperty(property) + ':' + value;
}