const Apply = require("./Apply");
const unimplemented = require("../polymorphic/debugging/unimplemented");

module.exports = Applicative = {
  map: Apply.map,
  ap: Apply.ap,
  of: unimplemented
};