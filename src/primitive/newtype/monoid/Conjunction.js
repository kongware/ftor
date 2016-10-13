const semigroup = require("../semigroup/Conjunction");
const {$concat, $_concat, $empty} = require("../../../interop/symbols");

module.exports = Conjunction = {
  [$concat]: semigroup[$concat],
  [$_concat]: semigroup[$_concat],
  [$empty]: () => true
};