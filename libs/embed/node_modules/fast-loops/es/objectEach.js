export default function objectEach(obj, iterator) {
  for (var key in obj) {
    iterator(obj[key], key, obj);
  }
}