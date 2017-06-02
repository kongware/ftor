"use strict";


// dependencies


const {$thunk} = require("./interop");


/**
 * @name tailrec
 * @note converts every tail recursive function in a stack safe version
 * @type higher order function
 * @status stable
 * @example

  $thunk = Symbol.for("ftor/thunk");

  const tailrec = f => (...args) => {
    let g = f(...args);
    while (g && g[$thunk]) g = g();
    return g;
  };

  const lazy = f => x => {
    const thunk = () => f(x);
    return (thunk[$thunk] = true, thunk);
  };

  const lazy2_ = f => (x, y) => {
    const thunk = () => f(x, y);
    return (thunk[$thunk] = true, thunk);
  };

  const fact = n => {
    const aux = (m, acc) => m === 0 ? acc : aux(m - 1, m * acc);
    return aux(n, 1);
  };

  const fact_ = n => {
    const aux = lazy2_((m, acc) => m === 0 ? acc : aux(m - 1, m * acc));
    return tailrec(aux) (n, 1);
  };

  const repeat = n => f => x => {
    const aux = lazy2_((n, x) => n === 0 ? x : aux(n - 1, f(x)));
    return tailrec(aux) (n, x);
  };

  const inc = x => x + 1;

  try {
    fact(1e6);
  } catch (_) {
    console.log("stack overflow"); // "stack overflow"
  }

  fact_(1e6); // Infinity
  repeat(1e6) (inc) (0); // 1000000

 */


// ((*) -> () -> a) -> (*) -> a
const tailrec = f => (...args) => {
  let g = f(...args);
  while (g && g[$thunk]) g = g();
  return g;
};


// API


module.exports = tailrec;