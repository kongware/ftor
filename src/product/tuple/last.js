"use strict";


/**
 * @name last item
 * @type first order function
 * @example

   const Tuple5 = (v, w, x, y, z) => f => f(v, w, x, y, z);
   const last = (...args) => args[args.length - 1];
   const tuple5 = Tuple5(1, "a", true, {foo: true}, ["bar"]);
   
   tuple5(last); // ["bar"]

 */


// (*) -> a
const last = (...args) => args[args.length - 1];


// API


module.exports = last;