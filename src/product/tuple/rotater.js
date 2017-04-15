"use strict";


// dependencies


const Tuple = require("./Tuple");


/**
 * @name rotate right
 * @type higher order function
 * @example

   const Tuple = (...args) => f => f(...args);
   const rotater = (z, x, y) => Tuple(x, y, z);
   const reduce = (f, acc, xs) => xs.reduce(f, acc);
   const composable = f => (...args) => x => f(...args, x);
   const add = (x, y) => x + y;

   const xs = [1, 2, 3, 4];
   const triple = Tuple(xs, add, 0);

   triple(rotater) (reduce); // 10

 */


// (c, a, b) -> ((a, b, c) -> d)
const rotater = (z, x, y) => Tuple(x, y, z);


// (d, a, b, c) -> ((a, b, c, d) -> e)
const rotater4 = (z, w, x, y) => Tuple(w, x, y, z);


// (e, a, b, c, d) -> ((a, b, c, d, e) -> f)
const rotater5 = (z, v, w, x, y) => Tuple(v, w, x, y, z);


// API


module.exports = {rotater, rotater4, rotater5};