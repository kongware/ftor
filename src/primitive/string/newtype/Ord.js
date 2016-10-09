const localeCompare = require("../../composite/polymorphic/localeCompare");
const {$compare, $gt, $gte, $lt, $lte, $min, $max} = require("../../interop/symbols");
const {LT, EQ, GT} = require("../../const/ord");

module.exports = Ord = {
  [$compare]: localeCompare,
  [$gt]: y => x => localeCompare(y) (x) === GT,
  [$gte]: y => x => localeCompare(y) (x) !== LT,
  [$lt]: y => x => localeCompare(y) (x) === LT,
  [$lte]: y => x => localeCompare(y) (x) !== GT,
  [$max]: y => x => localeCompare(y) (x) === GT ? x : y,
  [$min]: y => x => localeCompare(y) (x) === LT ? x : y
};