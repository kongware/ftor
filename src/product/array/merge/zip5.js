"use strict";

module.exports = ws => xs => ys => zs => vs => {
  const next = (acc, i) => vs.length <= i || ws.length <= i || xs.length <= i || ys.length <= i || zs.length <= i
     ? acc
     : next(acc.concat([[vs[i], ws[i], xs[i], ys[i], zs[i]]]), i + 1);

  return next([], 0);
};