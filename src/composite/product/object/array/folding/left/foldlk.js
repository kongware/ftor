module.exports = foldlk = f => acc => xs => {
  const next = (acc, k) => xs.length === k
   ? acc
   : f(acc) (xs[k], k) (acc => next(acc, k + 1));

  return next(acc, 0);
};