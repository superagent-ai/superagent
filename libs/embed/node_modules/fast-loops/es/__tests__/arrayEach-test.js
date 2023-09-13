import arrayEach from '../arrayEach';
describe('arrayEach', function () {
  it('should iterate an array', function () {
    var iterator = jest.fn();
    arrayEach([1, 2, 3, 4], iterator);
    expect(iterator).toHaveBeenCalledTimes(4);
    expect(iterator).toHaveBeenCalledWith(1, 0, 4, [1, 2, 3, 4]);
    expect(iterator).toHaveBeenCalledWith(2, 1, 4, [1, 2, 3, 4]);
    expect(iterator).toHaveBeenCalledWith(3, 2, 4, [1, 2, 3, 4]);
    expect(iterator).toHaveBeenCalledWith(4, 3, 4, [1, 2, 3, 4]);
  });
});