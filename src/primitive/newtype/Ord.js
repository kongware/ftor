const compare = require("../../composite/polymorphic/compare");
const gt = require("../polymorphic/operator/gt");
const gte = require("../polymorphic/operator/gte");
const lt = require("../polymorphic/operator/lt");
const lte = require("../polymorphic/operator/lte");
const max = require("../polymorphic/operator/max");
const min = require("../polymorphic/operator/min");
const {$compare, $gt, $gte, $lt, $lte, $max, $min} = require("../../interop/symbols");

module.exports = Ord = {
  [$compare]: compare,
  [$lt]: lt,
  [$lte]: lte,
  [$gt]: gt,
  [$gte]: gte,
  [$min]: min,
  [$max]: max
};