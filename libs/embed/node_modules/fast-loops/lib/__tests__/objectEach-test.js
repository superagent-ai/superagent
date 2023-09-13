"use strict";

var _objectEach = require("../objectEach");

var _objectEach2 = _interopRequireDefault(_objectEach);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('objectEach', function () {
  it('should iterate an object', function () {
    var iterator = jest.fn();
    (0, _objectEach2["default"])({
      1: 10,
      2: 20,
      3: 30,
      4: 40
    }, iterator);
    expect(iterator).toHaveBeenCalledTimes(4);
    expect(iterator).toHaveBeenCalledWith(10, '1', {
      1: 10,
      2: 20,
      3: 30,
      4: 40
    });
    expect(iterator).toHaveBeenCalledWith(20, '2', {
      1: 10,
      2: 20,
      3: 30,
      4: 40
    });
    expect(iterator).toHaveBeenCalledWith(30, '3', {
      1: 10,
      2: 20,
      3: 30,
      4: 40
    });
    expect(iterator).toHaveBeenCalledWith(40, '4', {
      1: 10,
      2: 20,
      3: 30,
      4: 40
    });
  });
});