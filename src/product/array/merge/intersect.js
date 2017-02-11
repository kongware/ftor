"use strict";

const createSet = require("../../../abstract/set/createSet");
const filter = require("../iterate/filter");

module.exports = ys => xs => {
  const zs = createSet(ys);
  return filter(x => zs.has(x)
     ? true
     : false
  ) (xs);
};