const destructiveDef = require("../product/object/mutation/destructiveDef");
const {$tag} = require("../../interop/symbols");

module.exports = factory = tag => (...values) => destructiveDef($tag, {value: tag}) (values);