const {$minBound, $maxBound} = require("../../interop/symbols");

module.exports = Bounded = {
  [$minBound]: -Infinity,
  [$maxBound]: Infinity
};