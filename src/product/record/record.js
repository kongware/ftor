"use strict";

const destructiveSet = require("../object/mutate/destructiveSet");
const foldl = require("../array/fold/foldl");
const seal = require("../object/seal");

module.exports = (...xs) => seal(foldl(acc => xs => destructiveSet(xs[0], xs[1]) (acc)) ({}) (xs));