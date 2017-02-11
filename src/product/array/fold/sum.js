"use strict";

const add = require("../../primitive/num/add");
const foldl = require("./foldl");

module.exports = xs => foldl(add) (0) (xs);