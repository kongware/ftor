const concat = require("../operator/concat");
const Semigroup = require("../../newtype/Semigroup");

module.exports = Object.assgin({}, Semigroup, {
  concat: concat
};