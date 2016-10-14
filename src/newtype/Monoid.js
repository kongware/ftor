const noop = require("../polymorphic/side_effect/noop");
const Semigroup = require("./Semigroup");
const {$concat, $_concat, $empty} = require("../interop/symbols");

module.exports = Monoid = {
  [$concat]: Semigroup[$concat],
  [$_concat]: Semigroup[$_concat],
  [$empty]: noop
};