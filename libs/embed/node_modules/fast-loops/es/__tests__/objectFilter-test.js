import objectFilter from '../objectFilter';
describe('objectFilter', function () {
  it('should filter an object', function () {
    expect(objectFilter({
      1: 10,
      2: 20,
      3: 30,
      4: 40
    }, function (value, key) {
      return value > 10 && parseInt(key, 10) % 2 === 0;
    })).toEqual({
      2: 20,
      4: 40
    });
  });
});