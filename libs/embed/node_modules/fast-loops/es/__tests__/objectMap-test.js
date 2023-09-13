import objectMap from '../objectMap';
describe('objectMap', function () {
  it('should map an object', function () {
    expect(objectMap({
      1: 10,
      2: 20,
      3: 30,
      4: 40
    }, function (value, key) {
      return value + parseInt(key, 10);
    }, 0)).toEqual({
      1: 11,
      2: 22,
      3: 33,
      4: 44
    });
  });
});