const I = require("../../polymorphic/primitive/I");
const Monoid = require("../Monoid");
const Semigroup = require("../semigroup/Endo2");
const {$concat, $_concat, $empty} = require("../../interop/symbols");

Monoid[$concat] = Semigroup[$concat];
Monoid[$_concat] = Semigroup[$_concat];
Monoid[$empty] = I;

module.exports = Semigroup;