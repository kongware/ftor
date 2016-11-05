const Bounded = require("../../../newtype/Bounded");

module.exports = Object.assign({}, Bounded, {
  minBound: false,
  maxBound: true
});