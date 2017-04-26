"use strict";


// dependencies


const assign = require("./assign");


/**
 * @name clone
 * @type first order function
 * @example
 *

   const o = {x: true}
   const p = clone(o); // {x: true}
   o === p; // false

 */


// Object -> Object
const clone = o => Object.assign({}, o);


// API


module.exports = clone;