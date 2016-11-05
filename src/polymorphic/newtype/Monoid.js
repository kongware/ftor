const I = require("../../polymorphic/primitive/I");
const Monoid = require("../../newtype/Monoid");
const Semigroup = require("./Semigroup");

module.exports = Object.assign({}, Monoid, {
  concat: Semigroup.concat,
  empty: I
});