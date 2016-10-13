const semigroup = require("../semigroup/Sum");
const {$concat, $_concat, $empty} = require("../../../interop/symbols");

module.exports = Sum = {
  [$concat]: semigroup[$concat],
  [$_concat]: semigroup[$_concat],
  [$empty]: () => 0
};