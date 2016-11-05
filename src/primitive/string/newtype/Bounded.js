const Bounded = require("../../../newtype/Bounded");

module.exports = Object.assign({}, Bounded, {
  minBound: "\u{0}",
  maxBound: "\u{10FFFF}"
};