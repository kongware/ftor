"use strict";

const flatten = require("./flatten");
const map = require("../iterate/map");

module.exports = xs => flatten(map(x => Array.isArray(x[0]) ? deepFlatten(x) : x) (xs));