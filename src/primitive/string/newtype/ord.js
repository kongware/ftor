const gt = require("../polymorphic/operator/gt");
const gte = require("../polymorphic/operator/gte");
const localCompare = require("../../composite/polymorphic/localCompare");
const lt = require("../polymorphic/operator/lt");
const lte = require("../polymorphic/operator/lte");
const max = require("../polymorphic/operator/max");
const min = require("../polymorphic/operator/min");
const {$compare, $gt, $gte, $lt, $lte, $min, $max} = require("../../interop/symbols");

module.exports = ord = {
  [$compare]: localCompare,
  [$gt]: gt,
  [$gte]: gte,
  [$lt]: lt,
  [$lte]: lte,
  [$max]: max,
  [$min]: min
};