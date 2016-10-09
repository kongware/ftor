const {$maxBound, $minBound} = require("../../interop/symbols");

module.exports = Bounded = {
  [$minBound]: -Infinity,
  [$maxBound]: Infinity
};