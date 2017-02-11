"use strict";

module.exports = f => acc => xs => {
  const next = (acc, i) => xs.length === i
   ? acc
   : f(acc) (xs[i], i) (acc => next(acc, i + 1));

  return next(acc, 0);
};