const or = require("../../polymorphic/operator/or");
const {$concat, $empty} = require("../../interop/symbols");

module.exports = Disjunction = {
  [$concat]: or,
  [$empty]: () => false
};