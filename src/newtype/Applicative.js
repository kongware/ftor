const Apply = require("./Apply");
const unimplemented = require("../polymorphic/side_effect/unimplemented");
const {$map, $ap, $of} = require("../../interop/symbols");

module.exports = Applicative = {
  [$map]: Apply[$map],
  [$ap]: Apply[$ap],
  [$of]: unimplemented
};