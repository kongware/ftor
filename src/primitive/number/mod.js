"use strict";


/**
 * @name mod
 * @type operator function
 * @example

   ?

 */


// Number -> Number -> Number
const mod = x => y => x % y;


// Number -> Number -> Number
const mod_ = y => x => x % y;


// API


module.exports = {mod, mod_};