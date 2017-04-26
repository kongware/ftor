"use strict";


/**
 * @name freeze object
 * @type first order function
 * @example
 *

   const o = freeze({x: 1, y: 2});
   o.z = 3; // {x: 1, y: 2}

 */


// Object -> Number
const freeze = Object.freeze;


// API


module.exports = freeze;