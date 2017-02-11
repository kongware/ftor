const keys = require("../reflection/keys");

// rev1
module.exports = para = order => f => acc => o => {
  const next = (acc, [head, ...tail]) => head === undefined
   ? acc
   : next(f(acc) (o[head], head) (tail), tail);

  return next(acc, order(keys(o)));
};