const next = require("../protocol/next");

module.exports = foldlk = f => acc => itor => {
  const loop = (acc, {value:x, done}) => done
   ? acc
   : f(acc) (x) (acc => loop(acc, next(itor)));

  return loop(acc, next(itor));
};