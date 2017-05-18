"use strict";


// dependencies


//const {B_} = require("../B");


/**
 * @name Tuple
 * @note combined namespace/constructor
 * @type product type
 * @status stable
 * @example

  const Tuple = (...args) => f => f(...args);
  Tuple.toArray = (...args) => args;
  const triple = Tuple(1, "a", true);

  triple(Tuple.toArray); // [1, "a", true]

 */


const Tuple = (...args) => f => f(...args);


/**
 * @name curry
 * @type higher order function
 * @status stable
 * @example

  const Tuple = (...args) => f => f(...args);
  Tuple.toArray = (...args) => args;

  Tuple.curry = tx => f => {
    const xs = tx(Tuple.toArray);
    return f(xs[0]) (xs[1]);
  };
   
  const add = y => x => x + y;
  const pair = Tuple(2, 3);
   
  Tuple.curry(pair) (add); // 5

 */


// ((a, b) -> c) -> (a -> b -> c) -> c
Tuple.curry = tx => f => {
  const xs = tx(Tuple.toArray);
  return f(xs[0]) (xs[1]);
};


// ((a, b, c) -> d) -> (a -> b -> c -> d) -> d
Tuple.curry3 = tx => f => {
  const xs = tx(Tuple.toArray);
  return f(xs[0]) (xs[1]) (xs[2]);
};


/**
 * @name to array
 * @type first order function
 * @status stable
 * @example

  const Tuple = (...args) => f => f(...args);
  Tuple.toArray = (...args) => args;

  Tuple(1, "a", true) (Tuple.toArray); // [1, "a", true]

 */


// [*] -> [*]
Tuple.toArray = (...args) => args;


// API


module.exports = Tuple;