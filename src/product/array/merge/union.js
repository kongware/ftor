"use strict";

const concat = require("../construct/concat");
const createSet = require("../../../abstract/set/createSet");
const filter = require("../iterate/filter");
const flip = require("../../../poly/primitive/flip");

module.exports = ys => xs => {
  const zs = createSet(xs);
  return flip(concat) (xs) (
    filter(x => zs.has(x)
     ? false
     : zs.add(x)
  ) (ys));
};