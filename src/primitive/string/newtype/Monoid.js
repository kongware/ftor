const Monoid = require("../../newtype/Monoid");
const Semigroup = require("./Semigroup");

module.exports = Object.assign({}, Monoid, {
  concat: Semigroup.concat,
  empty: () => ""
};