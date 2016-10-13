const compare = require("../../polymorphic/comparator/compare");
const _compare = require("../../polymorphic/comparator/_compare");
const gt = require("../polymorphic/operator/gt");
const _gt = require("../polymorphic/operator/_gt");
const gte = require("../polymorphic/operator/gte");
const _gte = require("../polymorphic/operator/_gte");
const lt = require("../polymorphic/operator/lt");
const _lt = require("../polymorphic/operator/_lt");
const lte = require("../polymorphic/operator/lte");
const _lte = require("../polymorphic/operator/_lte");
const max = require("../polymorphic/operator/max");
const min = require("../polymorphic/operator/min");
const {$compare, $_compare, $gt, $_gt, $gte, $_gte, $lt, $_lte, $lte, $max, $min} = require("../../interop/symbols");

module.exports = Ord = {
  [$compare]: compare,
  [$_compare]: _compare,
  [$lt]: lt,
  [$_lt]: lt,
  [$lte]: lte,
  [$_lte]: lte,
  [$gt]: gt,
  [$_gt]: gt,
  [$gte]: gte,
  [$_gte]: gte,
  [$min]: min,
  [$max]: max
};