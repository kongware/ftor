const noop = require("../polymorphic/side_effect/noop");
const {$pred, $succ} = require("../../interop/symbols");

module.exports = Enumerable = {
  [$pred]: noop,
  [$succ]: noop
};