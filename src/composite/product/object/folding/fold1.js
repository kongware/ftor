const keys = require("../reflection/keys");

// rev1
module.exports = fold1 = order => f => o => {
  const next = (acc, i) => props[i] === undefined
   ? acc
   : next(f(acc) (o[props[i]], props[i]), i + 1),
   props = order(keys(o));

  return next(o[props[0]], 1);
};