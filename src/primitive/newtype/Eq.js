const eq = require("../../polymorphic/operator/eq");
const {$equals} = require("../../interop/symbols");

module.exports = Eq = {
  [$equals]: eq,
};