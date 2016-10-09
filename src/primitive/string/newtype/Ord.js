const localeCompare = require("../../composite/polymorphic/localeCompare");
const {$compare, $gt, $gte, $lt, $lte, $max, $min} = require("../../interop/symbols");
const {LT, EQ, GT} = require("../../const/ord");

module.exports = Ord = {
  [$compare]: localeCompare,
  [$lt]: y => x => localeCompare(y) (x) === LT,
  [$lte]: y => x => localeCompare(y) (x) !== GT,
  [$gt]: y => x => localeCompare(y) (x) === GT,
  [$gte]: y => x => localeCompare(y) (x) !== LT,
  [$min]: y => x => localeCompare(y) (x) === LT ? x : y,
  [$max]: y => x => localeCompare(y) (x) === GT ? x : y
};