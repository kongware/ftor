const or = require("../../../polymorphic/operator/or");
const _or = require("../../../polymorphic/operator/_or");
const {$concat, $_concat} = require("../../../interop/symbols");

module.exports = Disjunction = {
  [$concat]: or,
  [$_concat]: _or
};