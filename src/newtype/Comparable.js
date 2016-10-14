const noop = require("../polymorphic/side_effect/noop");
const {$equals} = require("../interop/symbols");

module.exports = Comparable = {
  [$equals]: noop
};