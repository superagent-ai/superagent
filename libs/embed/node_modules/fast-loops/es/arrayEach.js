export default function arrayEach(arr, iterator) {
  for (var i = 0, len = arr.length; i < len; ++i) {
    iterator(arr[i], i, len, arr);
  }
}