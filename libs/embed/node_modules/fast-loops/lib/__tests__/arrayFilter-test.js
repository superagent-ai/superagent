"use strict";

var _arrayFilter = require("../arrayFilter");

var _arrayFilter2 = _interopRequireDefault(_arrayFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('arrayFilter', function () {
  it('should filter an array', function () {
    expect((0, _arrayFilter2["default"])([1, 2, 3, 4], function (value) {
      return value > 2;
    })).toEqual([3, 4]);
  });
});