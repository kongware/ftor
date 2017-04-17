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
   const setn = n => x => (...args) => (args[n - 1] = x, Tuple(...args));

   const triple = Tuple(1, "a", true);
   const triple_ = triple(setn(1) (0));

   triple_(toArray); // [0, "a", true]
   console.assert(triple !== triple_); // passes

 */


// Number -> a -> (*) -> ((*) -> a)
const setn = n => x => (...args) => (args[n - 1] = x, Tuple(...args));


// API


module.exports = setn;