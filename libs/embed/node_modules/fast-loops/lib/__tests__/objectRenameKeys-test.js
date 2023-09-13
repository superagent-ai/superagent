"use strict";

var _objectRenameKeys = require("../objectRenameKeys");

var _objectRenameKeys2 = _interopRequireDefault(_objectRenameKeys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('objectRenameKeys', function () {
  it('should reduce an object', function () {
    expect((0, _objectRenameKeys2["default"])({
      foo: 1,
      bar: 2,
      baz: 3
    }, {
      baz: 'foobar'
    })).toEqual({
      foo: 1,
      bar: 2,
      foobar: 3
    });
  });
});