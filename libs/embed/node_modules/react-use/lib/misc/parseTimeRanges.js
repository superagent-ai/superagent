"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseTimeRanges(ranges) {
    var result = [];
    for (var i = 0; i < ranges.length; i++) {
        result.push({
            start: ranges.start(i),
            end: ranges.end(i),
        });
    }
    return result;
}
exports.default = parseTimeRanges;
