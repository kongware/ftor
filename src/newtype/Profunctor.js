const Functor = require("./Functor");
const unimplemented = require("../polymorphic/debugging/unimplemented");

module.exports = Profunctor = {
  map: Functor.map,
  promap: unimplemented
};