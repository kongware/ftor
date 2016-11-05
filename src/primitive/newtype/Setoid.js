const eq = require("../../polymorphic/operator/eq");
const neq = require("../../polymorphic/operator/neq");
const Setoid = require("../../newtype/Setoid");

module.exports = Object.assgin({}, Setoid, {
  eq: eq,
  neq: neq
};