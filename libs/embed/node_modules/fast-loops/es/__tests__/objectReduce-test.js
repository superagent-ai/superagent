import objectReduce from '../objectReduce';
describe('objectReduce', function () {
  it('should reduce an object', function () {
    expect(objectReduce({
      1: 10,
      2: 20,
      3: 30,
      4: 40
    }, function (out, value, key) {
      return out + value - parseInt(key, 10);
    }, 0)).toEqual(90);
  });
});