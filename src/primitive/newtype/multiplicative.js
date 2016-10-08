const mul = require("../number/operator/mul");
const eq = require("../../polymorphic/operator/eq");
const {$concat, $empty, $equals} = require("../../interop/symbols");

module.exports = multiplicative = {
  [$equals]: eq,
  [$concat]: mul,
  [$empty]: () => 1
};