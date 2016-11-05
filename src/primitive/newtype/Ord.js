const compare = require("../../polymorphic/comparator/compare");
const gt = require("../polymorphic/operator/gt");
const gte = require("../polymorphic/operator/gte");
const lt = require("../polymorphic/operator/lt");
const lte = require("../polymorphic/operator/lte");
const max = require("../polymorphic/operator/max");
const min = require("../polymorphic/operator/min");
const Ord = require("../../newtype/Ord");

module.exports = Object.assgin({}, Ord, {
  compare: compare,
  lt: lt,
  lte: lte,
  gt: gt,
  gte: gte,
  min: min,
  max: max
};