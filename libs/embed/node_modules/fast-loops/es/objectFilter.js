export default function objectFilter(obj, filter) {
  var filteredObj = {};

  for (var key in obj) {
    var value = obj[key];

    if (filter(value, key, obj)) {
      filteredObj[key] = value;
    }
  }

  return filteredObj;
}