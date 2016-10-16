module.exports = foldrk = f => acc => xs => {
  const next = (key, acc) => key < 0
   ? acc
   : f(xs[key]) (acc) (acc => next(key - 1, acc));

  return next(xs.length - 1, acc);
};