"use strict";


// dependencies


const Tuple = require("./Tuple");


/**
 * @name set nth element
 * @type operator function
 * @example

   const triple = Tuple(1, 2, 3);
   toArray(triple(set1(0))); // [0, 2, 3]

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