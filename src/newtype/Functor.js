const unimplemented = require("../polymorphic/side_effect/unimplemented");
const {$map} = require("../../interop/symbols");

module.exports = Functor = {
  [$map]: unimplemented
};