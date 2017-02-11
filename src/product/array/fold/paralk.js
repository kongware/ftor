"use strict";

module.exports = f => acc => xs => {
  const next = (acc, [head, ...tail]) => head === undefined
   ? acc
   : f(acc) (head, tail, acc => next(acc, tail));

  return next(acc, xs);
};