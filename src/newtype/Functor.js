const unimplemented = require("../polymorphic/side_effect/unimplemented");
const {$map, $_map} = require("../../interop/symbols");

module.exports = Functor = {
  [$map]: unimplemented,
  [$_map]: unimplemented
};