"use strict";

const destructiveDef = require("../product/object/mutate/destructiveDef");
const {$tag} = require("../interop/symbols");

module.exports = tag => (...values) => destructiveDef($tag, {value: tag}) (values);