module.exports = foldrk = f => acc => xs => {
  const next = (k, acc) => k < 0
   ? acc
   : f(xs[k], k) (acc) (acc => next(k - 1, acc));

  return next(xs.length - 1, acc);
};