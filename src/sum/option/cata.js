"use strict";


/**
 * @name catamorphism
 * @type first order function
 * @example

   const safeInc = cata({Some: x => x + 1, None: () => 0});
   
   safeInc(Some(5)); // 6
   safeInc(None()); // 0

 */


// Object -> Option -> a
const cata = pattern => ({tag, x}) => pattern[tag](x);


// API


module.exports = cata;