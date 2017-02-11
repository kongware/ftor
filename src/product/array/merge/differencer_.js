"use strict";

const differencel = require("./differencel");
const uncurry = require("../../../poly/curry/uncurry");

module.exports = uncurry(differencel);