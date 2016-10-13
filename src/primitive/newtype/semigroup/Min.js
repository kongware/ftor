const compare = require("../../../polymorphic/comparator/compare");
const flip = require("../../../polymorphic/argument/flip");
const {$concat, $_concat} = require("../../../interop/symbols");
const {LT} = require("../../../const/ORDERING");

// TODO: add compareBy?
module.exports = Min = {
  [$concat]: y => x => compare(y) (x) === LT ? x : y,
  [$_concat]: flip(Min[$concat]);
};