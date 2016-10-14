const comp4 = require("../../polymorphic/composition/comp4");
const flip = require("../../polymorphic/arguments/flip");
const Semigroup = require("../Semigroup");
const {$concat, $_concat} = require("../../interop/symbols");

Semigroup[$concat] = comp4;
Semigroup[$_concat] = flip(comp4);

module.exports = Semigroup;