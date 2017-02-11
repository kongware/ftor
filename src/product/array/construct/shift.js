"use strict";

const head = require("../extract/head");
const tail = require("../extract/tail");

module.exports = xs => [head(xs), tail(xs)];