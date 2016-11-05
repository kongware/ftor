const Monoid = require("../../../newtype/Monoid");
const Sum = require("../semigroup/Sum");

module.exports = Object.assign({}, Monoid, {
  concat: Sum.concat,
  empty: () => 0
};