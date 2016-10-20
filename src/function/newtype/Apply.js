const lift = require("../../../polymorphic/primitive/lift");
const _lift = require("../../../polymorphic/primitive/_/_lift");
const Apply = require("../../../newtype/Apply");
const {$map, $_amp, $ap, $_ap} = require("../../../interop/symbols");

Apply[$map] = Functor[$concat];
Monoid[$_concat] = Semigroup[$_concat];
Monoid[$empty] = I;

module.exports = Semigroup;