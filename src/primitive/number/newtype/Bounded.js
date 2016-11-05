const Bounded = require("../../../newtype/Bounded");

module.exports = Object.assign({}, Bounded, {
  minBound: Number.MIN_SAFE_INTEGER,
  maxBound: Number.MAX_SAFE_INTEGER
};