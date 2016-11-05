const I = require("../../polymorphic/primitive/I");
const Monoid = require("../../newtype/Monoid");
const Semigroup2 = require("./Semigroup2");

module.exports = Object.assign({}, Monoid, {
  concat: Semigroup2.concat,
  empty: I
});