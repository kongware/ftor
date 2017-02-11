"use strict";

module.exports = f => vs => ws => xs => ys => zs => {
  const next = (acc, i) => vs.length || ws.length <= i || xs.length <= i || ys.length <= i || zs.length <= i
     ? acc
     : next(acc.concat([f(vs[i]) (ws[i]) (xs[i]) (ys[i]) (zs[i])]), i + 1);

  return next([], 0);
};