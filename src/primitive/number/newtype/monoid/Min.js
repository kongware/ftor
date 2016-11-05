const Bounded = require("../Bounded");
const Min = require("../semigroup/Min");
const Monoid = require("../../../newtype/Monoid");

module.exports = Object.assign({}, Monoid, {
  concat: Min.concat,
  empty: Bounded.maxBound
};