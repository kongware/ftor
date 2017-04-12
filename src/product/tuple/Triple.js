"use strict";


/**
 * @name triple tuple
 * @type data constructor
 * @example

   Triple(1, 2, 3) (_1st); // 1
   Triple(1, 2, 3) (_2nd); // 2
   Triple(1, 2, 3) (_3rd); // 3

 */


// (a, b, c) -> ((a, b, c) => d) -> d
const Triple = (x, y, z) => f => f(x, y, z);


// API


module.exports = Triple;