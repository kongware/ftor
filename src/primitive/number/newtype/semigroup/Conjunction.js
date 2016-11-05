const and = require("../../../polymorphic/operator/and");
const Semigroup = require("../../../newtype/Semigroup");

module.exports = Object.assgin({}, Semigroup, {
  concat: and
};