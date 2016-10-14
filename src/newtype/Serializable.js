const noop = require("../polymorphic/side_effect/noop");
const {$toJSON, $toString} = require("../../interop/symbols");

module.exports = Serializable = {
  [$toJSON]: noop,
  [$toString]: noop
};