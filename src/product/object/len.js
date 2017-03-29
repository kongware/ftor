"use strict";


/**
 * @name property length
 * @type operator function
 * @example
 *

   const o = {x: 1, y: 2, z: 3};
   len(o); // 3

 */


// Object -> Number
const len = o => Object.keys(o).length;


// API


module.exports = len;