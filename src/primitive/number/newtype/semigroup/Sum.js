const add = require("../../number/operator/add");
const Semigroup = require("../../../newtype/Semigroup");

module.exports = Object.assgin({}, Semigroup, {
  concat: add
};