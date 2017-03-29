"use strict";


/**
 * @name seal object
 * @type operator function
 * @example
 *

   const o = seal({x: 1, y: 2});
   o.z = 3; // {x: 1, y: 2}
   o.x = 0; // {x: 0, y: 2}

 */


// Object -> Number
const seal = Object.seal;


// API


module.exports = seal;