"use strict";


// dependencies


const toArray = require("./toArray");


/**
 * @name curry operator function
 * @type higher order function
 * @example

   const Pair = (x, y) => f => f(x, y);
   const toArray = (...args) => args;
   const curryOp = t => f => (t = t(toArray), f(t[1]) (t[0]));
   const sub = y => x => x - y;
   const pair = Pair(2, 3);
   
   curryOp(pair) (sub); // -1

 */


// ((a, b) -> c) -> (b -> a -> c) -> c
const curryOp = t => f => (t = t(toArray), f(t[1]) (t[0]));


// ((a, b, c) -> d) -> (c -> a -> b -> d) -> d
const curryOp3 = t => f => (t = t(toArray), f(t[2]) (t[0]) (t[1]));


// API


module.exports = {curryOp, curryOp3};