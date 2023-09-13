"use strict";

var _objectMap = require("../objectMap");

var _objectMap2 = _interopRequireDefault(_objectMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('objectMap', function () {
  it('should map an object', function () {
    expect((0, _objectMap2["default"])({
      1: 10,
      2: 20,
      3: 30,
      4: 40
    }, function (value, key) {
      return value + parseInt(key, 10);
    }, 0)).toEqual({
      1: 11,
      2: 22,
      3: 33,
      4: 44
    });
  });
});