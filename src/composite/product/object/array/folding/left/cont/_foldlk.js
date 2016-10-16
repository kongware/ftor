module.exports = _foldlk = (f, acc, xs) => {
  const next = (acc, key) => xs.length === key
   ? acc
   : f(acc) (xs[key]) (acc => next(acc, key + 1));

  return next(acc, 0);
};