export default function objectFind(obj, query) {
  for (var key in obj) {
    if (query(obj[key], key, obj)) {
      return key;
    }
  }
}