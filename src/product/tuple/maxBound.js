"use strict";


// dependencies


const Single = require("./Single");


/**
 * @name maxinmal bounded Single
 * @type operator function
 * @example
 *

   const _Number = {maxBound: Infinity};
   maxBound(_Number) (x => x); // Infinity

 */


// Bounded a => Object -> (a -> b)
const maxBound = Rep => Single(Rep.maxBound);


// API


module.exports = maxBound;