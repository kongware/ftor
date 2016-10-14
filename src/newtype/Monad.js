const Applicative = require("./Applicative");
const Chain = require("./Chain");
const noop = require("../polymorphic/side_effect/noop");
const {$ap, $of, $chain} = require("../../interop/symbols");

module.exports = Monad = {
  [$ap]: Applicative[$ap],
  [$of]: Applicative[$of],
  [$chain]: Applicative[$chain]
};