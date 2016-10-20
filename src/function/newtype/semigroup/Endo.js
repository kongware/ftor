const comp = require("../../../polymorphic/composition/comp");
const _comp = require("../../../polymorphic/composition/_/_comp");
const Semigroup = require("../../../newtype/Semigroup");
const {$concat, $_concat} = require("../../../interop/symbols");

Semigroup[$concat] = comp;
Semigroup[$_concat] = _comp;

module.exports = Semigroup;