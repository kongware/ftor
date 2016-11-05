const Apply = require("./Apply");
const unimplemented = require("../polymorphic/debugging/unimplemented");

module.exports = Chain = {
  map: Apply.map,
  ap: Apply.ap,
  chain: unimplemented
};