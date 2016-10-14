const noop = require("../polymorphic/side_effect/noop");
const {$concat, $_concat} = require("../interop/symbols");

module.exports = Semigroup = {
  [$concat]: noop,
  [$_concat]: noop
};