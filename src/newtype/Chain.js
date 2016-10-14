const Apply = require("./Apply");
const noop = require("../polymorphic/side_effect/noop");
const {$ap, $chain} = require("../../interop/symbols");

module.exports = Chain = {
  [$ap]: Apply[$ap],
  [$chain]: noop
};