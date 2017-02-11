"use strict";

const afrom = require("../construct/afrom");
const comp = require("../../../poly/compose/comp");
const createSet = require("../../../abstract/set/createSet");

module.exports = comp(afrom) (createSet);