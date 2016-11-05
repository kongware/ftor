const unimplemented = require("../polymorphic/debugging/unimplemented");
const Semigroup = require("./Semigroup");

module.exports = Monoid = {
  concat: Semigroup.concat,
  empty: unimplemented
};