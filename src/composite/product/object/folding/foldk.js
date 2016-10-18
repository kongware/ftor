const keys = require("../reflection/keys");

module.exports = foldk = f => acc => o => {
  const next = (acc, k) => ks.length === k
   ? acc
   : f(acc) (o[ks[k]], ks[k]) (acc => next(acc, k + 1));
  const ks = keys(o);

  return next(acc, 0);
};