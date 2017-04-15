"use strict";


// dependencies


const toArray = require("./toArray");


/**
 * @name curry
 * @type higher order function
 * @example

   const Pair = (x, y) => f => f(x, y);
   const toArray = (...args) => args;
   const curry = t => f => (t = t(toArray), f(t[0]) (t[1]));
   const add = y => x => x + y;
   const pair = Pair(2, 3);
   
   curry(pair) (add); // 5

 */


// ((a, b) -> c) -> (a -> b -> c) -> c
const curry = t => f => (t = t(toArray), f(t[0]) (t[1]));


// ((a, b, c) -> d) -> (a -> b -> c -> d) -> d
const curry3 = t => f => (t = t(toArray), f(t[0]) (t[1]) (t[2]));


// API


module.exports = {curry, curry3};