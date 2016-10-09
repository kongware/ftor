const mul = require("../number/operator/mul");
const {$concat, $empty} = require("../../interop/symbols");

module.exports = Product = {
  [$concat]: mul,
  [$empty]: () => 1
};