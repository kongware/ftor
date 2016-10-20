const unimplemented = require("../polymorphic/side_effect/unimplemented");
const {$equals, $_equals} = require("../interop/symbols");

module.exports = Setoid = {
  [$equals]: unimplemented,
  [$_equals]: unimplemented
};