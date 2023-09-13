"use strict";

var _objectFilter = require("../objectFilter");

var _objectFilter2 = _interopRequireDefault(_objectFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('objectFilter', function () {
  it('should filter an object', function () {
    expect((0, _objectFilter2["default"])({
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