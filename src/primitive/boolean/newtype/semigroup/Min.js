const compare = require("../../../polymorphic/comparator/compare");
const Semigroup = require("../../../newtype/Semigroup");
const {LT} = require("../../../newtype/Order");

// TODO: add compareBy?
module.exports = Object.assign({}, Semigroup, {
  concat: y => x => compare(y) (x) === LT ? x : y
};