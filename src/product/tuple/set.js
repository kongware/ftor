"use strict";


// dependencies


const Tuple = require("./Tuple");


/**
 * @name set nth element
 * @type higher order function
 * @example

   const Tuple = (...args) => f => f(...args);
   const Triple = (x, y, z) => f => f(x, y, z);
   const toArray = (...args) => args;
   const set1 = x => (_, ...args) => Tuple(x, ...args);

   const triple = Tuple(1, "a", true);
   const triple_ = triple(set1(0));

   triple_(toArray); // [0, "a", true]
   console.assert(triple !== triple_); // passes

 */


// a -> (_, (*)) -> ((*) -> a)
const set1 = x => (_, ...args) => Tuple(x, ...args);


// a -> (b, _, (*)) -> ((*) -> a)
const set2 = y => (x, _, ...args) => Tuple(x, y, ...args);


// a -> (b, c, _, (*)) -> ((*) -> a)
const set3 = z => (x, y, _, ...args) => Tuple(x, y, z, ...args);


// a -> (b, c, d, _, (*)) -> ((*) -> a)
const set4 = z => (w, x, y, _, ...args) => Tuple(w, x, y, z, ...args);


// a -> (b, c, d, e, _, (*)) -> ((*) -> a)
const set5 = z => (v, w, x, y, _, ...args) => Tuple(v, w, x, y, z, ...args);


// API


module.exports = {set1, set2, set3, set4, set5};