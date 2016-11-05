const Functor = require("./Functor");
const unimplemented = require("../polymorphic/debugging/unimplemented");

module.exports = Bifunctor = {
  map: Functor.map,
  bimap: unimplemented
};