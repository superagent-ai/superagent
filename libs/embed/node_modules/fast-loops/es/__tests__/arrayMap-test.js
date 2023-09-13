import arrayMap from '../arrayMap';
describe('arrayMap', function () {
  it('should map an array', function () {
    expect(arrayMap([1, 2, 3], function (val) {
      return val * val;
    })).toEqual([1, 4, 9]);
  });
});