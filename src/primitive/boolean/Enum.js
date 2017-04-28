"use strict";


// dependencies


const {A} = require("../../A");
const of = require("./of");


/**
 * @name Enumeration
 * @note partial order
 * @type type representative
 * @status stable
 */


const Enum = {};


/**
 * @name successor
 * @note works with truthy/falsy values as well
 * @type first order function
 * @status stable
 * @example

   const A = f => x => f(x);

   const Enum = {};
   Enum.succ = A(x => x ? null : true);

   Enum.succ(false); // true
   Enum.succ(true); // null

 */


// a -> Boolean|null
Enum.succ = A(x => x ? null : true);


/**
 * @name predecessor
 * @note works with truthy/falsy values as well
 * @type first order function
 * @status stable
 * @example

   @see successor

 */


// a -> Boolean|null
Enum.pred = A(x => x ? false : null);


/**
 * @name to enumeration
 * @note works with truthy/falsy values as well
 * @type first order function
 * @status stable
 * @example

   @see Enum.fromEnum

 */


// a => Boolean
Enum.toEnum = of;


/**
 * @name from enumeration
 * @note works with truthy/falsy values as well
 * @type first order function
 * @status stable
 * @example

   const A = f => x => f(x);

   const Enum = {};
   Enum.fromEnum = A(x => x ? 1 : 0);

   Enum.fromEnum(false); // 0
   Enum.fromEnum(true); // 1
   Enum.fromEnum(""); // 0
   Enum.fromEnum("foo"); // 1

 */


// a => Number
Enum.fromEnum = A(x => x ? 1 : 0);


/**
 * @name enumeration from
 * @note works with truthy/falsy values as well
 * @type first order function
 * @status stable
 * @example

   const A = f => x => f(x);
   const of = x => Boolean(x);

   const Enum = {};
   Enum.succ = A(x => x ? null : true);
   Enum.toEnum = of;

   Enum.enumFrom = x => {
     const aux = (x, acc) => x === null
      ? acc
      : aux(Enum.succ(x), acc.concat(x));

     return aux(Enum.toEnum(x), []);
   };

   Enum.enumFrom(false); // [false, true]
   Enum.enumFrom(true); // [true]

 */


// a => [Boolean]
Enum.enumFrom = x => {
  const aux = (x, acc) => x === null
   ? acc
   : aux(Enum.succ(x), acc.concat(x));

  return aux(Enum.toEnum(x), []);
};


// API


module.exports = Enum;