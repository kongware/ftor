const semigroup = require("../semigroup/Product");
const {$concat, $_concat, $empty} = require("../../../interop/symbols");

module.exports = Product = {
  [$concat]: semigroup[$concat],
  [$_concat]: semigroup[$_concat],
  [$empty]: () => 1
};