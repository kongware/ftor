"use strict";

module.exports = f => acc => xs => {
  const next = (acc, [head, ...tail]) => head === undefined
   ? acc
   : next(f(acc) (head, tail), tail);

  return next(acc, xs);
};