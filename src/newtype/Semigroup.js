const unimplemented = require("../polymorphic/side_effect/unimplemented");
const {$concat, $_concat} = require("../interop/symbols");

module.exports = Semigroup = {
  [$concat]: unimplemented,
  [$_concat]: unimplemented
};