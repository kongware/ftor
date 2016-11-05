const Functor = require("./Functor");
const unimplemented = require("../polymorphic/debugging/unimplemented");

module.exports = Apply = {
  map: Functor.map,
  ap: unimplemented
};