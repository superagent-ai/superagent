"use strict";

var _objectFind = require("../objectFind");

var _objectFind2 = _interopRequireDefault(_objectFind);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('objectFind', function () {
  it('should return the first key that matches the query', function () {
    expect((0, _objectFind2["default"])({
      1: 10,
      2: 20,
      3: 30,
      4: 40
    }, function (value) {
      return value > 20;
    })).toEqual('3');
  });
  it('should return undefined if no matching pair is found', function () {
    expect((0, _objectFind2["default"])({
      1: 10,
      2: 20,
      3: 30,
      4: 40
    }, function (value) {
      return value > 50;
    })).toEqual(undefined);
  });
  it('should pass value, key, object to the query', function () {
    expect((0, _objectFind2["default"])({
      1: 10,
      2: 20,
      3: 30,
      4: 40
    }, function (value, key, obj) {
      return value === 30 && key === '3' && obj[key] === value;
    })).toEqual('3');
  });
});