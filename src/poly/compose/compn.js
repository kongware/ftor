"use strict";

const comp = require("./comp");
const I = require("../primitive/I");
const foldr = require("../../product/array/fold/foldr");

module.exports = foldr(comp) (I);