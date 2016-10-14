const comp3 = require("../../polymorphic/composition/comp3");
const flip = require("../../polymorphic/arguments/flip");
const Semigroup = require("../Semigroup");
const {$concat, $_concat} = require("../../interop/symbols");

Semigroup[$concat] = comp3;
Semigroup[$_concat] = flip(comp3);

module.exports = Semigroup;