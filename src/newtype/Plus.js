const Alt = require("./Alt");
const unimplemented = require("../polymorphic/debugging/unimplemented");

module.exports = Plus = {
  map: Alt.map,
  alt: Alt.alt,
  zero: unimplemented
};