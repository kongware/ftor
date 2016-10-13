const and = require("../../../polymorphic/operator/and");
const _and = require("../../../polymorphic/operator/_and");
const {$concat, $_concat} = require("../../../interop/symbols");

module.exports = Conjunction = {
  [$concat]: and,
  [$_concat]: _and
};