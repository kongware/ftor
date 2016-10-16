module.exports = parar = f => acc => xs => {
  const next = (xs, x, acc) => x === undefined
   ? acc
   : next(init(xs), last(xs), f(x) (acc) (xs));

  return next(init(xs), last(xs), acc);
}

