"use strict";

const init = require("../extract/init");
const last = require("../extract/last");

module.exports = xs => [init(xs), last(xs)];