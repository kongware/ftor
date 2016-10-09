const and = require("../../polymorphic/operator/and");
const {$concat, $empty} = require("../../interop/symbols");

module.exports = Conjunction = {
  [$concat]: and,
  [$empty]: () => true
};