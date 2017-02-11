"use strict";

const createSet = require("../../../abstract/set/createSet");
const filter = require("../iterate/filter");

module.exports = (xs, ys) => {
  const zs = createSet(ys);
  return filter(x => zs.has(x)
     ? false
     : true
  ) (xs);
};