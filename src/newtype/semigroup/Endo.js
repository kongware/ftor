const comp = require("../../polymorphic/composition/comp");
const flip = require("../../polymorphic/arguments/flip");
const Semigroup = require("../Semigroup");
const {$concat, $_concat} = require("../../interop/symbols");

Semigroup[$concat] = comp;
Semigroup[$_concat] = flip(comp);

module.exports = Semigroup;