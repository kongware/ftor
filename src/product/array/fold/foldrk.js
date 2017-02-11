"use strict";

module.exports = f => acc => xs => {
  const next = (i, acc) => i < 0
   ? acc
   : f(xs[i], i) (acc) (acc => next(i - 1, acc));

  return next(xs.length - 1, acc);
};