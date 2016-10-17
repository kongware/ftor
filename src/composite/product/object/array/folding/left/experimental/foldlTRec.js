module.exports = foldlTRec = f => acc => xs => {
  const next = (acc, key) => xs.length === key
   ? acc
   : next(f(acc) (xs[key]), key + 1);

  return next(acc, 0);
};