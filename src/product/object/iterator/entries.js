"use strict";

const keys = require("../reflect/keys");

module.exports = o => () => {
  const next = (k, v) => k === xs.length
   ? {value: [v, o[v]], next: null}
   : {value: [v, o[v]], next: () => next(k + 1, xs[k])},
   xs = keys(o);

  return xs.length === 0
   ? {value: null, next: null}
   : next(1, xs[0]);
};