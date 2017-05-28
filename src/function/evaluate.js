"use strict";


/**
 * @name evaluate
 * @type higher order function
 * @status experimental
 * @example

  $thunk = Symbol.for("ftor/thunk");

  const evaluate = f => (...args) => {
    let g = f(...args);
    
    while (typeof g === "function" && $thunk in g) g = g();
    return g;
  };

  const lazy2_ = f => (x, y) => {
    const thunk = () => f(x, y);
    return (thunk[$thunk] = true, thunk);
  };

  const repeat = n => f => x => {
    const aux = (x, n) => n === 0 ? x : thunk(f(x), n - 1),
     thunk = lazy2_(aux);

    return evaluate(aux) (x, n);
  };

  const inc = x => x + 1;

  repeat(1e6) (inc) (0); // 1000000

 */


// ((*) -> () -> a) -> (*) -> a
const evaluate = f => (...args) => {
  let g = f(...args);
  
  while (typeof g === "function" && $thunk in g) g = g();
  return g;
};


// API


module.exports = evaluate;