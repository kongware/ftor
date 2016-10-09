const add = require("../number/operator/add");
const {$concat, $empty} = require("../../interop/symbols");

module.exports = Sum = {
  [$concat]: add,
  [$empty]: () => 0
};