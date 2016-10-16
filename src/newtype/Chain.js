const Apply = require("./Apply");
const unimplemented = require("../polymorphic/side_effect/unimplemented");
const {$ap, $chain} = require("../../interop/symbols");

module.exports = Chain = {
  [$ap]: Apply[$ap],
  [$chain]: unimplemented
};