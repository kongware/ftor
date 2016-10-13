const semigroup = require("../semigroup/Max");
const {$concat, $_concat, $empty, $minBound} = require("../../../interop/symbols");

module.exports = Max = {
  [$concat]: semigroup[$concat],
  [$_concat]: semigroup[$_concat],
  [$empty]: Bounded => () => Bounded[$minBound];
};