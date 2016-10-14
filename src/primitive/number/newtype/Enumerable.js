const {$pred, $succ} = require("../../interop/symbols");

module.exports = Enumerable = {
  [$pred]: dec,
  [$succ]: inc
};