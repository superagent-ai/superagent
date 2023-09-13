import objectReduce from './objectReduce';
export default function objectRenameKeys(obj, keys) {
  return objectReduce(obj, function (newObj, value, key) {
    newObj[keys[key] || key] = value;
    return newObj;
  }, {});
}