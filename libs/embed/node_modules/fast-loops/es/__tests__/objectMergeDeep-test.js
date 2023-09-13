import objectMergeDeep from '../objectMergeDeep';
describe('objectMergeDeep', function () {
  it('should deep merge two object', function () {
    expect(objectMergeDeep({
      foo: 1,
      bar: {
        foo: 2,
        bar: 3
      },
      baz: {
        foo: {
          foo: 1,
          baz: 4
        }
      }
    }, {
      foobar: 4,
      bar: {
        bar: 4,
        baz: 3
      },
      baz: {
        foo: {
          foo: 2,
          bar: 3
        },
        bar: 1
      }
    })).toEqual({
      foo: 1,
      foobar: 4,
      bar: {
        foo: 2,
        bar: 4,
        baz: 3
      },
      baz: {
        foo: {
          foo: 2,
          bar: 3,
          baz: 4
        },
        bar: 1
      }
    });
  });
  it('should deep merge two object with new keys', function () {
    expect(objectMergeDeep({}, {
      foo: {
        bar: 1
      }
    })).toEqual({
      foo: {
        bar: 1
      }
    });
  });
});