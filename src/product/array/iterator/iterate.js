"use strict";

module.exports = xs => f => {
  const next = (f, k) => xs.length === k
   ? f(k, xs[k]) (null)
   : f(k, xs[k]) (f => next(f, k + 1));

  return xs.length === 0 
   ? f(null) (null)
   : next(f, 0);
};