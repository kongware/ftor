const assign = require("../construction/assign");
const {$concat, $empty} = require("../../../interop/symbols");

module.exports = Assign = {
  [$concat]: p => o => assign([o, p]),
  [$empty]: () => {}
};