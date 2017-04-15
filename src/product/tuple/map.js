"use strict";


// dependencies


const Tuple = require("./Tuple");


/**
 * @name map over nth element
 * @type higher order function
 * @example

   const Tuple = (...args) => f => f(...args);
   const Triple = (x, y, z) => f => f(x, y, z);
   const toArray = (...args) => args;
   const map3 = f => (x, y, z, ...args) => Tuple(x, y, f(z), ...args);
   
   const sqr = x => x * x;
   const triple = Triple(1, 2, 3);
   
   triple(map3(sqr)) (toArray); // [1, 2, 9]

 */


// (a -> b) -> (a, (*)) -> ((*) -> c)
const map1 = f => (x, ...args) => Tuple(f(x), ...args);


// (b -> c) -> (a, b, (*)) -> ((*) -> d)
const map2 = f => (x, y, ...args) => Tuple(x, f(y), ...args);


// (c -> d) -> (a, b, c, (*)) -> ((*) -> e)
const map3 = f => (x, y, z, ...args) => Tuple(x, y, f(z), ...args);


// (d -> e) -> (a, b, c, d, (*)) -> ((*) -> f)
const map4 = f => (w, x, y, z, ...args) => Tuple(w, x, y, f(z), ...args);


// (e -> f) -> (a, b, c, d, e, (*)) -> ((*) -> g)
const map5 = f => (v, w, x, y, z, ...args) => Tuple(v, w, x, y, f(z), ...args);


// API


module.exports = {map1, map2, map3, map4, map5};