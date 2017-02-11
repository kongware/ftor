"use strict";

const uncurry = require("../../tuple/uncurry");

module.exports = f => xs => xs.sort(uncurry(f));