const next = require("../protocol/next");

module.exports = foldlk = f => acc => itor => {
  const loop = (acc, {value:a, done}) => done
   ? acc
   : f(acc) (a) (acc => loop(acc, next(itor)));

  return loop(acc, next(itor));
};