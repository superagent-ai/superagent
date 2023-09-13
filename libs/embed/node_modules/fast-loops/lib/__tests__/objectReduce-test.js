"use strict";

var _objectReduce = require("../objectReduce");

var _objectReduce2 = _interopRequireDefault(_objectReduce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('objectReduce', function () {
  it('should reduce an object', function () {
    expect((0, _objectReduce2["default"])({
      1: 10,
      2: 20,
      3: 30,
      4: 40
    }, function (out, value, key) {
      return out + value - parseInt(key, 10);
    }, 0)).toEqual(90);
  });
});