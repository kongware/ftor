module.exports = foldrTRec = f => acc => xs => {
  const next = (key, acc) => key < 0
   ? acc
   : next(key - 1, f(xs[key]) (acc))

  return next(xs.length - 1, acc);
};