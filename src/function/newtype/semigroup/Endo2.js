const comp = require("../../../polymorphic/composition/comp");
const _comp = require("../../../polymorphic/composition/_/_comp2");
const Semigroup = require("../../../newtype/Semigroup");
const {$concat, $_concat} = require("../../../interop/symbols");

Semigroup[$concat] = comp2;
Semigroup[$_concat] = _comp2;

module.exports = Semigroup;