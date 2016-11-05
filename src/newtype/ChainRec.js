const Chain = require("./Chain");
const unimplemented = require("../polymorphic/debugging/unimplemented");

module.exports = ChainRec = {
  map: Chain.map,
  ap: Chain.ap,
  chainRec: unimplemented
};