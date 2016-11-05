const Applicative = require("./Applicative");
const Plus = require("./Plus");
const unimplemented = require("../polymorphic/debugging/unimplemented");

module.exports = Alternative = {
  map: Applicative.map,
  ap: Applicative.ap,
  of: Applicative.of,
  alt: Plus.alt,
  zero: Plus.zero
};