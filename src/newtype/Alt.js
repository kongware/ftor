const Functor = require("./Functor");
const unimplemented = require("../polymorphic/debugging/unimplemented");

module.exports = Alt = {
  map: Functor.map,
  alt: unimplemented
};