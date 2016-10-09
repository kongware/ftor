const {$maxBound, $minBound} = require("../../interop/symbols");

module.exports = BoundedStr = {
  [$minBound]: "\u{0}",
  [$maxBound]: "\u{10FFFF}"
};