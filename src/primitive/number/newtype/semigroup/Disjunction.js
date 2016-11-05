const or = require("../../../polymorphic/operator/or");
const Semigroup = require("../../../newtype/Semigroup");

module.exports = Object.assign({}, Semigroup, {
  concat: or
};