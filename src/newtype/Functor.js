const noop = require("../polymorphic/side_effect/noop");
const {$map} = require("../../interop/symbols");

module.exports = Functor = {
  [$map]: noop
};