"use strict";

const keys = require("../reflect/keys");

module.exports = f => acc => o => {
  const next = (acc, [head, ...tail]) => head === undefined
   ? acc
   : next(f(acc) (o[head], head) (tail), tail);

  return next(acc, keys(o));
};