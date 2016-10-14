const Foldable = require("./Foldable");
const Functor = require("./Functor");
const noop = require("../polymorphic/side_effect/noop");
const {$map, $foldl, $foldr, $foldl_, $foldr_} = require("../../interop/symbols");

module.exports = Traversable = {
  [$map]: Functor[$map],
  [$foldl]: Foldable[$foldl],
  [$foldr]: Foldable[$foldr],
  [$foldl_]: Foldable[$foldl_],
  [$foldr_]: Foldable[$foldr_],
  [$traverse]: noop
};