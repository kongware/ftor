const Functor = require("./Functor");
const unimplemented = require("../polymorphic/side_effect/unimplemented");
const {$map, $_amp, $ap, $_ap} = require("../../interop/symbols");

module.exports = Apply = {
  [$map]: Functor[$map],
  [$_map]: Functor[$_map],
  [$ap]: unimplemented,
  [$_ap]: unimplemented
};