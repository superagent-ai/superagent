import cssifyDeclaration from './cssifyDeclaration';
export default function cssifyObject(style) {
  var css = '';

  for (var property in style) {
    var value = style[property];

    if (typeof value !== 'string' && typeof value !== 'number') {
      continue;
    } // prevents the semicolon after
    // the last rule declaration


    if (css) {
      css += ';';
    }

    css += cssifyDeclaration(property, value);
  }

  return css;
}