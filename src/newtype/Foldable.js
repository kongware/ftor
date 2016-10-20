const unimplemented = require("../polymorphic/side_effect/unimplemented");
const {$foldl, $foldl1, $foldlk, $foldr, $foldr1, $foldrk} = require("../../interop/symbols");

module.exports = Foldable = {
  [$fold]: unimplemented,
  [$foldl]: unimplemented,
  [$foldr]: unimplemented,
};