const Disjunction = require("../semigroup/Disjunction");
const Monoid = require("../../../newtype/Monoid");

module.exports = Object.assign({}, Monoid, {
  concat: Disjunction.concat,
  empty: () => false
};