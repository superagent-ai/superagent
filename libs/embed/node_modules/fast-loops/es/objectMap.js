export default function objectMap(obj, mapper) {
  var mappedObj = {};

  for (var key in obj) {
    mappedObj[key] = mapper(obj[key], key, obj);
  }

  return mappedObj;
}