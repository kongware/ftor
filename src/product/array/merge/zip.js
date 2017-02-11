"use strict";

module.exports = ys => xs => {
  const next = (acc, i) => xs.length <= i || ys.length <= i
     ? acc
     : next(acc.concat([[xs[i], ys[i]]]), i + 1);

  return next([], 0);
};