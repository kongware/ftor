"use strict";


// dependencies


const {A} = require("../../A");
const of = require("./of");


/**
 * @name Enumeration
 * @type type representative
 */


const Enum = {};


/**
 * @name successor
 * @type operator function
 * @example

   ?

 */


// a -> Boolean|null
Enum.succ = A(x => x ? null : true);


/**
 * @name predecessor
 * @type operator function
 * @example

   @see successor

 */


// a -> Boolean|null
Enum.pred = A(x => x ? false : null);


/**
 * @name to enumeration
 * @type operator function
 * @example

   ?

 */


// a => Boolean
Enum.toEnum = of;


/**
 * @name from enumeration
 * @type operator function
 * @example

   ?

 */


// a => Number
Enum.fromEnum = A(x => x ? 1 : 0);


/**
 * @name enumeration from
 * @type operator function
 * @example

   ?

 */


// a => [Boolean]
Enum.enumFrom = x => {
  const aux = (x, acc) => x === null
   ? acc
   : aux(succ(x), acc.concat(x));

  return aux(toEnum(x), []);
};


// API


module.exports = {};