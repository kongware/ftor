module.exports = foldlTRec = f => acc => xs => {
  const next = (acc, k) => xs.length === k
   ? acc
   : next(f(acc) (xs[k], k), k + 1);

  return next(acc, 0);
};