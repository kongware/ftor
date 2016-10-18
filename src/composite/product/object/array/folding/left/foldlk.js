module.exports = foldlk = f => acc => xs => {
  const next = (acc, key) => xs.length === key
   ? acc
   : f(acc) (xs[key], key) (acc => next(acc, key + 1));

  return next(acc, 0);
};