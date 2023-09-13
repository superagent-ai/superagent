import arrayFilter from '../arrayFilter';
describe('arrayFilter', function () {
  it('should filter an array', function () {
    expect(arrayFilter([1, 2, 3, 4], function (value) {
      return value > 2;
    })).toEqual([3, 4]);
  });
});