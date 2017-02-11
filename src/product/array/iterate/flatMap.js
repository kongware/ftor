"use strict";

const comp = require("../../poly/compose/comp");
const concat = require("../construct/concat");
const foldr = require("../fold/foldr");

module.exports = f => foldr(comp(concat) (f)) ([]);