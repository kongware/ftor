"use strict";

const init = require("../extract/init");
const last = require("../extract/last");

module.exports = f => acc => xs => {
  const next = (head, acc, tail) => head === undefined
   ? acc
   : next(last(tail), f(head) (acc, tail), init(tail));

  return next(last(xs), acc, init(xs));
};