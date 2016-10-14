const Functor = require("./Functor");
const noop = require("../polymorphic/side_effect/noop");
const {$map, $ap} = require("../../interop/symbols");

module.exports = Apply = {
  [$map]: Functor[$map],
  [$ap]: noop
};