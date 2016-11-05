const Conjunction = require("../semigroup/Conjunction");
const Monoid = require("../../../newtype/Monoid");

module.exports = Object.assign({}, Monoid, {
  concat: Conjunction.concat,
  empty: () => true
};