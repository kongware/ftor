const mul = require("../../number/operator/mul");
const _mul = require("../../number/operator/_mul");
const {$concat, $_concat} = require("../../../interop/symbols");

module.exports = Product = {
  [$concat]: mul,
  [$_concat]: _mul
};