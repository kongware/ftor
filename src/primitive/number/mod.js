"use strict";


/**
 * @name mod
 * @type operator function
 * @example

   ?

 */


// Number -> Number -> Number
const mod = y => x => x % y;


// Number -> Number -> Number
const mod_ = x => y => x % y;


// API


module.exports = {mod, mod_};