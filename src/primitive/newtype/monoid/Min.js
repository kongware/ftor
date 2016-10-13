const semigroup = require("../semigroup/Min");
const {$concat, $_concat, $empty, $maxBound} = require("../../../interop/symbols");

module.exports = Min = {
  [$concat]: semigroup[$concat],
  [$_concat]: semigroup[$_concat],
  [$empty]: Bounded => () => Bounded[$maxBound];
};