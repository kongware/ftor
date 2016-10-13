const semigroup = require("../semigroup/Disjunction");
const {$concat, $_concat, $empty} = require("../../../interop/symbols");

module.exports = Disjunction = {
  [$concat]: semigroup[$concat],
  [$_concat]: semigroup[$_concat],
  [$empty]: () => false
};