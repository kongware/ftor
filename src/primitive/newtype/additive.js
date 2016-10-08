const add = require("../number/operator/add");
const eq = require("../../polymorphic/operator/eq");
const {concat, empty, equals} = require("../../interop/symbols");

module.exports = additive = {
  [equals]: eq,
  [concat]: add,
  [empty]: () => 0
};