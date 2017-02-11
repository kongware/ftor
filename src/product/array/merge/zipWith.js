"use strict";

module.exports = f => xs => ys => {
  const next = (acc, i) => xs.length <= i || ys.length <= i
     ? acc
     : next(acc.concat([f(xs[i]) (ys[i])]), i + 1);

  return next([], 0);
};