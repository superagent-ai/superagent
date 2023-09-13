"use strict";

var _arrayMap = require("../arrayMap");

var _arrayMap2 = _interopRequireDefault(_arrayMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('arrayMap', function () {
  it('should map an array', function () {
    expect((0, _arrayMap2["default"])([1, 2, 3], function (val) {
      return val * val;
    })).toEqual([1, 4, 9]);
  });
});