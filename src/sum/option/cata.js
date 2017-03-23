"use strict";


/**
 * @name catamorphism
 * @type function
 * @example

   const safeInc = cata({Some: x => x + 1, None: () => 0});
   
   safeInc(Some(5)); // 6
   safeInc(None()); // 0

 */


// Object -> Option -> a
const cata = pattern => ({tag, x}) => pattern[tag](x);


// (Option, Object) -> a
const cata_ = ({tag, x}, pattern) => pattern[tag](x);


// API


module.exports = {cata, cata_};