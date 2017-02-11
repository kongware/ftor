"use strict";

module.exports = (ws, xs, ys, zs) => {
  const next = (acc, i) => ws.length <= i || xs.length <= i || ys.length <= i || zs.length <= i
     ? acc
     : next(acc.concat([[ws[i], xs[i], ys[i], zs[i]]]), i + 1);

  return next([], 0);
};