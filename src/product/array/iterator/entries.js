"use strict";

module.exports = xs => () => {
  const next = (k, v) => k === xs.length
   ? {value: [k - 1, v], next: null}
   : {value: [k - 1, v], next: () => next(k + 1, xs[k])};

  return xs.length === 0
   ? {value: null, next: null}
   : next(1, xs[0]);
};