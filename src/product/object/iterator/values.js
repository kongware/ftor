"use strict";

const values = require("../reflect/values");

module.exports = o => () => {
  const next = (k, v) => k === xs.length
   ? {value: v, next: null}
   : {value: v, next: () => next(k + 1, xs[k])},
   xs = values(o);

  return xs.length === 0
   ? {value: null, next: null}
   : next(1, xs[0]);
};