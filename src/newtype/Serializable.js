const unimplemented = require("../polymorphic/side_effect/unimplemented");
const {$toJSON, $toString} = require("../../interop/symbols");

module.exports = Serializable = {
  [$toJSON]: unimplemented,
  [$toString]: unimplemented
};