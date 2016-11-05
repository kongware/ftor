const Bounded = require("../Bounded");
const Max = require("../semigroup/Max");
const Monoid = require("../../../newtype/Monoid");

module.exports = Object.assign({}, Monoid, {
  concat: Max.concat,
  empty: Bounded.minBound;
};