"use strict";

var _arrayReduce = require("../arrayReduce");

var _arrayReduce2 = _interopRequireDefault(_arrayReduce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('arrayReduce', function () {
  it('should reduce an array', function () {
    expect((0, _arrayReduce2["default"])([1, 2, 3], function (out, value) {
      return out + value;
    }, 0)).toEqual(6);
  });
});