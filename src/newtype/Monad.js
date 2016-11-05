const Applicative = require("./Applicative");
const Chain = require("./Chain");
const unimplemented = require("../polymorphic/debugging/unimplemented");

module.exports = Monad = {
  map: Applicative.map,
  ap: Applicative.ap,
  of: Applicative.of,
  chain: Chain.chain
};