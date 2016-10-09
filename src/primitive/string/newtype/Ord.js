const localeCompare = require("../../composite/polymorphic/localeCompare");
const {$compare, $gt, $gte, $lt, $lte, $max, $min} = require("../../interop/symbols");
const {LT, EQ, GT} = require("../../const/ord");

module.exports = Ord = {
  [$compare]: localeCompare,
  [$lt]: b => a => localeCompare(b) (a) === LT,
  [$lte]: b => a => localeCompare(b) (a) !== GT,
  [$gt]: b => a => localeCompare(b) (a) === GT,
  [$gte]: b => a => localeCompare(b) (a) !== LT,
  [$min]: b => a => localeCompare(b) (a) === LT ? a : b,
  [$max]: b => a => localeCompare(b) (a) === GT ? a : b
};