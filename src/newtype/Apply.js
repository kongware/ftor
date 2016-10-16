const Functor = require("./Functor");
const unimplemented = require("../polymorphic/side_effect/unimplemented");
const {$map, $ap} = require("../../interop/symbols");

module.exports = Apply = {
  [$map]: Functor[$map],
  [$ap]: unimplemented
};