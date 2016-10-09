const {$maxBound, $minBound} = require("../../interop/symbols");

module.exports = BoundedNum = {
  [$minBound]: -Infinity,
  [$maxBound]: Infinity
};