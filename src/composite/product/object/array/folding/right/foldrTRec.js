module.exports = foldrTRec = f => acc => xs => {
  const next = (k, acc) => k < 0
   ? acc
   : next(k - 1, f(xs[k]) (acc))

  return next(xs.length - 1, acc);
};