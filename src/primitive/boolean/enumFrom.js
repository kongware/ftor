"use strict";


// dependencies


const succ = require("./succ");
const of = require("./toEnum");


/**
 * @name enumeration from
 * @note works with truthy/falsy values as well
 * @type first order function
 * @status stable
 * @example

   const succ = x => x ? null : true;
   const of = x => Boolean(x);

   const enumFrom = x => {
     const aux = (x, acc) => x === null
      ? acc
      : aux(succ(x), acc.concat(x));

     return aux(of(x), []);
   };

   enumFrom(false); // [false, true]
   enumFrom(true); // [true]

 */


// a => [Boolean]
const enumFrom = x => {
  const aux = (x, acc) => x === null
   ? acc
   : aux(succ(x), acc.concat(x));

  return aux(of(x), []);
};


// API


module.exports = enumFrom;