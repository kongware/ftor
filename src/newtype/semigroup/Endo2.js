const comp2 = require("../../polymorphic/composition/comp2");
const flip = require("../../polymorphic/arguments/flip");
const Semigroup = require("../Semigroup");
const {$concat, $_concat} = require("../../interop/symbols");

Semigroup[$concat] = comp2;
Semigroup[$_concat] = flip(comp2);

module.exports = Semigroup;