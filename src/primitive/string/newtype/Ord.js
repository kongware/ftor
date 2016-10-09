const localeCompare = require("../../composite/polymorphic/localeCompare");
const {$compare, $gt, $gte, $lt, $lte, $min, $max} = require("../../interop/symbols");
const {LT, EQ, GT} = require("../../const/ord");

module.exports = Ord = {
  [$compare]: localeCompare,
  [$gt]: b => a => localeCompare(b) (a) === GT,
  [$gte]: b => a => localeCompare(b) (a) !== LT,
  [$lt]: b => a => localeCompare(b) (a) === LT,
  [$lte]: b => a => localeCompare(b) (a) !== GT,
  [$max]: b => a => localeCompare(b) (a) === GT ? a : b,
  [$min]: b => a => localeCompare(b) (a) === LT ? a : b
};