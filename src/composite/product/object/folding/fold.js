const keys = require("../reflection/keys");

module.exports = fold = f => acc => o => {
  const next = (acc, k) => ks.length === k
   ? acc
   : next(f(acc) (o[ks[k]], ks[k]), k + 1);
  const ks = keys(o);

  return next(acc, 0);
};