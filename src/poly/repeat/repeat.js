"use strict";

module.exports = n => f => x => {
  const next = (x, n) => n > 0 ? next(f(x), n - 1) : x;
  return next(x, n);
};