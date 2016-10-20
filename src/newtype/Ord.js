const unimplemented = require("../polymorphic/side_effect/unimplemented");
const {$compare, $_compare, $gt, $_gt, $gte, $_gte, $lt, $_lt, $lte, $_lte, $min, max} = require("../interop/symbols");

module.exports = Ord = {
  [$compare]: unimplemented,
  [$_compare]: unimplemented,
  [$lt]: unimplemented,
  [$_lt]: unimplemented,
  [$lte]: unimplemented,
  [$_lte]: unimplemented,
  [$gt]: unimplemented,
  [$_gt]: unimplemented,
  [$gte]: unimplemented,
  [$_gte]: unimplemented,
  [$min]: unimplemented,
  [$max]: unimplemented
};