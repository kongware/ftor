const noop = require("../polymorphic/side_effect/noop");
const {$foldl, $foldr, $foldl_, $foldr_} = require("../../interop/symbols");

module.exports = Foldable = {
  [$foldl]: noop,
  [$foldr]: noop,
  [$foldl_]: noop,
  [$foldr_]: noop
};