const unimplemented = require("../polymorphic/side_effect/unimplemented");
const {$equals} = require("../interop/symbols");

module.exports = Comparable = {
  [$equals]: unimplemented
};