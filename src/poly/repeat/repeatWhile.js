"use strict";

module.exports = n => pred => f => x => {
  const next = (x, n, prev) => pred(n, x) ? next(f(x), n - 1, x) : prev;
  return next(x, n, x);
};