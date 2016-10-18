const init = require("../../subarray/init");
const last = require("../../destructuring/last");

module.exports = paralk = f => acc => xs => {
  const next = (head, acc, tail) => head === undefined
   ? acc
   : f(head) (acc, tail, acc => next(last(tail), acc, init(tail)));

  return next(last(xs), acc, init(xs));
};