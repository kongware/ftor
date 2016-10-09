const concat = require("../accumulation/concat");
const {$concat, $empty} = require("../../../../interop/symbols");

module.exports = Concat = {
  [$concat]: concat,
  [$empty]: () => []
};