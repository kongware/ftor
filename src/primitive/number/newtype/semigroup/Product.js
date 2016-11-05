const mul = require("../../number/operator/mul");
const Semigroup = require("../../../newtype/Semigroup");

module.exports = Object.assign({}, Semigroup, {
  concat: mul
};