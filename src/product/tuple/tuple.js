"use strict";

const seal = require("../object/seal");

module.exports = (x, y) => f => f(x, y);