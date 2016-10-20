const unimplemented = require("../polymorphic/side_effect/unimplemented");
const {$pred, $succ} = require("../../interop/symbols");

module.exports = Enum = {
  [$pred]: unimplemented,
  [$succ]: unimplemented
};