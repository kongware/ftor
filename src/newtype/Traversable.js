const Foldable = require("./Foldable");
const Functor = require("./Functor");
const unimplemented = require("../polymorphic/debugging/unimplemented");

module.exports = Traversable = {
  map: Functor.map,
  fold: Foldable.fold,
  traverse: unimplemented
};