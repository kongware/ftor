"use strict";


/**
 * @name sub
 * @type first order function
 * @example

   ?

 */


// Number -> Number -> Number
const sub = x => y => x - y;


// Number -> Number -> Number
const sub_ = y => x => x - y;


// API


module.exports = {sub, sub_};