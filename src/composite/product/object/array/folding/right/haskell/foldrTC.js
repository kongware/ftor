const destructivePush = require("../../../mutation/destructivePush");
const flip = require("../../../../../../../polymorphic/primitive/flip");
const foldl = require("../../left/foldl");

module.exports = foldrTC = f => acc => xs => {
  const next = (key, acc) => xs[key] === undefined
   ? foldl(flip(f)) (acc) (stack)
   : (destructivePush(xs[key]) (stack), next(key - 1, acc));
  const stack = [];

  return next(xs.length - 1, acc);
};