const keys = require("../reflection/keys");

module.exports = fold1 = f => o => {
  const next = (acc, k) => ks.length === k
   ? acc
   : next(f(acc) (o[ks[k]], ks[k]), k + 1);
  const ks = keys(o);

  return ks.length === 0
   ? raise(TypeError) ("non-empty dict expected")
   : next(o[ks[0]], 1);
};