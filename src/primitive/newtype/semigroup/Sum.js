const add = require("../../number/operator/add");
const _add = require("../../number/operator/_add");
const {$concat, $_concat} = require("../../../interop/symbols");

module.exports = Sum = {
  [$concat]: add,
  [$_concat]: _add
};