const Extend = require("./Extend");
const Functor = require("./Functor");
const unimplemented = require("../polymorphic/debugging/unimplemented");

module.exports = Comonad = {
  map: Functor.map,
  extend: Extend.extend,
  extract: unimplemented
};