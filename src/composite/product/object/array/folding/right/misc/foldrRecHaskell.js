module.exports = foldrRec = f => acc => xs => {
  const next = (key, acc) => xs[key] === undefined
   ? acc
   : f(xs[key]) (next(key - 1, acc));

  return next(xs.length - 1, acc);
};