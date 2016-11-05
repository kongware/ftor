const compare = require("../../../polymorphic/comparator/compare");
const Semigroup = require("../../../newtype/Semigroup");
const {GT} = require("../../../newtype/Order");

// TODO: add compareBy?
module.exports = Object.assgin({}, Semigroup, {
  concat: y => x => compare(y) (x) === GT ? x : y
};