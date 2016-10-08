const eq = require("../../polymorphic/operator/eq");
const or = require("../../polymorphic/operator/or");
const {concat, empty, equals} = require("../../interop/symbols");

module.exports = disjunction = {
  [equals]: eq,
  [concat]: or,
  [empty]: () => false
};