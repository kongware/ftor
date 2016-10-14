const noop = require("../polymorphic/side_effect/noop");
const {$compare, $_compare, $gt, $_gt, $gte, $_gte, $lt, $_lt, $lte, $_lte, $min, max} = require("../interop/symbols");

module.exports = Orderable = {
  [$compare]: noop,
  [$_compare]: noop,
  [$lt]: noop,
  [$_lt]: noop,
  [$lte]: noop,
  [$_lte]: noop,
  [$gt]: noop,
  [$_gt]: noop,
  [$gte]: noop,
  [$_gte]: noop,
  [$min]: noop,
  [$max]: noop
};