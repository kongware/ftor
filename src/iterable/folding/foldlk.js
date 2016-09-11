const next = require("../protocol/next");

module.exports = foldlk = f => acc => iter => {
  const loop = (acc, {value:x, done}) => done
   ? acc
   : f(acc) (x) (acc => loop(acc, next(iter)));

  return loop(acc, next(iter));
};