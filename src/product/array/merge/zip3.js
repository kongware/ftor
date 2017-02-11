"use strict";

module.exports = ys => zs => xs =>  {
  const next = (acc, i) => xs.length <= i || ys.length <= i || zs.length <= i
     ? acc
     : next(acc.concat([[xs[i], ys[i], zs[i]]]), i + 1);

  return next([], 0);
};