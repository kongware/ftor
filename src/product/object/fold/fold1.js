"use strict";

const keys = require("../reflect/keys");

module.exports = f => o => {
  const next = (acc, i) => k[i] === undefined
   ? acc
   : next(f(acc) (o[k[i]], k[i]), i + 1),
   k = keys(o);

  return next(o[k[i]], 1);
};