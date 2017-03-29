"use strict";


// dependencies


const Single = require("./Single");


/**
 * @name mininmal bounded Single
 * @type operator function
 * @example
 *

   const _Number = {minBound: -Infinity};
   minBound(_Number) (x => x); // -Infinity

 */


// Bounded a => Object -> (a -> b)
const minBound = Rep => Single(Rep.minBound);


// API


module.exports = minBound;