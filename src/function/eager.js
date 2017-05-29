"use strict";


// dependencies


const {$thunk} = require("./interop");


/**
 * @name eager
 * @type higher order function
 * @status stable
 * @example

  $thunk = Symbol.for("ftor/thunk");

  const eager = f => (...args) => {
    let g = f(...args);
    while (g && g[$thunk]) g = g();
    return g;
  };

  const lazy2_ = f => (x, y) => {
    const thunk = () => f(x, y);
    return (thunk[$thunk] = true, thunk);
  };

  const repeat = n => f => x => {
    const aux = lazy2_((n, x) => n === 0 ? x : aux(n - 1, f(x)));
    return eager(lazy2_(aux)) (n, x);
  };

  const inc = x => x + 1;

  repeat(1e6) (inc) (0); // 1000000

 */


// ((*) -> () -> a) -> (*) -> a
const eager = f => (...args) => {
  let g = f(...args);
  while (g && g[$thunk]) g = g();
  return g;
};


// API


module.exports = evaluate;