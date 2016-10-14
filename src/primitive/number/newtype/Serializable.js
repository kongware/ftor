const {$toJSON, $toString} = require("../../interop/symbols");

module.exports = Serializable = {
  [$toJSON]: x => x.toString(),
  [$toString]: x => x.toString()
};