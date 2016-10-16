const unimplemented = require("../polymorphic/side_effect/unimplemented");
const {$fold, $foldl, $foldr, $foldl_, $foldr_, $foldMap, $foldMap_} = require("../../interop/symbols");

module.exports = Foldable = {
  [$fold]: unimplemented,
  [$foldl]: unimplemented,
  [$foldr]: unimplemented,
  [$foldl_]: unimplemented,
  [$foldr_]: unimplemented,
  [$foldMap]: unimplemented,
  [$foldMap_]: unimplemented
};