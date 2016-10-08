const and = require("../../polymorphic/operator/and");
const eq = require("../../polymorphic/operator/eq");
const {concat, empty, equals} = require("../../interop/symbols");

module.exports = conjunction = {
  [equals]: eq,
  [concat]: and,
  [empty]: () => true
};