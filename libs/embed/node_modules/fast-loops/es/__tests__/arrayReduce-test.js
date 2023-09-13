import arrayReduce from '../arrayReduce';
describe('arrayReduce', function () {
  it('should reduce an array', function () {
    expect(arrayReduce([1, 2, 3], function (out, value) {
      return out + value;
    }, 0)).toEqual(6);
  });
});