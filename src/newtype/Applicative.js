const Apply = require("./Apply");
const noop = require("../polymorphic/side_effect/noop");
const {$map, $ap, $of} = require("../../interop/symbols");

module.exports = Applicative = {
  [$map]: Apply[$map],
  [$ap]: Apply[$ap],
  [$of]: noop
};