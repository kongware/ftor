const unimplemented = require("../polymorphic/side_effect/unimplemented");
const {$pred, $succ} = require("../../interop/symbols");

module.exports = Enumerable = {
  [$pred]: unimplemented,
  [$succ]: unimplemented
};