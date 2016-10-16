const compare = require("../../../polymorphic/comparator/compare");
const flip = require("../../../polymorphic/primitive/flip");
const {$concat, $_concat} = require("../../../interop/symbols");
const {GT} = require("../../../const/ORDERING");

// TODO: add compareBy?
module.exports = Max = {
  [$concat]: y => x => compare(y) (x) === GT ? x : y,
  [$_concat]: flip(Max[$concat]);
};