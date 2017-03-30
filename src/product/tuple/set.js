"use strict";


// dependencies


const Tuple = require("./Tuple");


/**
 * @name set nth item
 * @type operator function
 * @example
 *

   const triple = Tuple(1, 2, 3);
   const triple_ = triple(set1(0));
   triple(get1); // 1
   triple_(get1); // 0

 */


// a -> (_, [*]) -> Function
const set1 = x => (_, ...args) => Tuple(x, ...args);


// a -> (b, _, [*]) -> Function
const set2 = y => (x, _, ...args) => Tuple(x, y, ...args);


// a -> (b, c, _, [*]) -> Function
const set3 = z => (x, y, _, ...args) => Tuple(x, y, z, ...args);


// a -> (b, c, d, _, [*]) -> Function
const set4 = z => (w, x, y, _, ...args) => Tuple(w, x, y, z, ...args);


// a -> (b, c, d, e, _, [*]) -> Function
const set5 = z => (v, w, x, y, _, ...args) => Tuple(v, w, x, y, z, ...args);


// API


module.exports = {set1, set2, set3, set4, set5};