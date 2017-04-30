"use strict";


/**
 * @name Bool
 * @note combined type and constructor; primitive
 * @type type representative
 * @kind *
 * @status stable
 */


// constructor


/**
 * @name Bool
 * @note lambda to prevent new-operator use
 * @type constructor
 * @status stable
 */


const Bool = x => Boolean(x);


// catamorphism


/**
 * @name bool
 * @note lazy conditional expression as a catamorphism for booleans analogous to foldr on lists
 * @status stable
 * @example

   const Bool = x => Boolean(x);
   Bool.bool = x => y => z => z ? y : x;
   
   const eq = x => y => Object.is(x, y);

   Bool.bool("foo") ("bar") (eq(2) (2)); // "bar"

 */


// a -> a -> Boolean -> a
Bool.bool = x => y => z => z ? y : x;


// Bounded


/**
 * @name minimal bound
 * @type constant
 * @status stable
 */


// Boolean
Bool.minBound = false


/**
 * @name maximal bound
 * @type constant
 * @status stable
 */


// Boolean
const maxBound = true


// Enum


/**
 * @name successor
 * @note works with truthy/falsy values as well
 * @type first order function
 * @status stable
 * @example

   const succ = x => x ? null : true;

   succ(false); // true
   succ(true); // null

 */


// a -> Boolean|null
const succ = x => x ? null : true;


/**
 * @name predecessor
 * @note works with truthy/falsy values as well
 * @type first order function
 * @status stable
 * @example

   @see succ

 */


// a -> Boolean|null
const pred = x => x ? false : null;


/**
 * @name toEnum
 * @note works with all types through implicit type coercion
 * @type first order function
 * @status stable
 * @example

   const Bool = x => Boolean(x);
   Bool.toEnum = Bool;
   
   Bool.toEnum("foo"); // true
   Bool.toEnum(""); // false

 */


// a -> Boolean
const toEnum = Bool;


/**
 * @name from enumeration
 * @note works with truthy/falsy values as well
 * @type first order function
 * @status stable
 * @example

   const fromEnum = x => x ? 1 : 0;

   fromEnum(false); // 0
   fromEnum(true); // 1

   // implicit type coercion:
   
   fromEnum(""); // 0
   fromEnum("foo"); // 1

 */


// a -> Number
const fromEnum = x => x ? 1 : 0;


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
   : aux(Bool.succ(x), acc.concat(x));

  return aux(Bool.toEnum(x), []);
};


// Ord


/**
 * @name compare
 * @note works with all types through explicit type cast
 * @type first order function
 * @status stable
 * @example

   const Ordering = {};
   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   const compare = x => y => {
     x = !!x;
     y = !!y;

     return x < y ? LT
      : x > y ? GT
      : EQ;
   };

   compare(false) (true); // LT
   compare(true) (false); // GT
   compare("foo") ("bar"); // EQ

 */


// a -> a -> Ordering
const compare = x => y => {
  x = !!x;
  y = !!y;

  return x < y ? LT
   : x > y ? GT
   : EQ;
};


// a -> a -> Ordering
const compare_ = y => x => {
  x = !!x;
  y = !!y;

  return x < y ? LT
   : x > y ? GT
   : EQ;
};


/**
 * @name lower than
 * @note works with all types through explicit type cast
 * @type first order function
 * @status stable
 * @example

   const lt = x => y => !!x < !!y;

   lt(false) (true); // true
   lt("foo") (""); // false
   lt("foo") ("bar"); // false

 */


// a -> a -> Boolean
const lt = x => y => !!x < !!y;


// a -> a -> Boolean
const lt_ = y => x => !!x < !!y;


/**
 * @name lower than or equal
 * @note works with all types through explicit type cast
 * @type first order function
 * @status stable
 * @example

   const lte = x => y => !!x <= !!y;

   lte(false) (true); // true
   lte("foo") (""); // false
   lte("foo") ("bar"); // true

 */


// a -> a -> Boolean
const lte = x => y => !!x <= !!y;


// a -> a -> Boolean
const lte_ = y => x => !!x <= !!y;


/**
 * @name greater than
 * @note works with all types through explicit type cast
 * @type first order function
 * @status stable
 * @example

   @see lt

 */


// a -> a -> Boolean
const gt = x => y => !!x > !!y;


// a -> a -> Boolean
const gt_ = y => x => !!x > !!y;


/**
 * @name greater than or equal
 * @note works with all types through explicit type cast
 * @type first order function
 * @status stable
 * @example

   @see lte

 */


// a -> a -> Boolean
const gte = x => y => !!x >= !!y;


// a -> a -> Boolean
const gte_ = y => x => !!x >= !!y;


/**
 * @name minimal value
 * @note works with all types through explicit type cast; commutative
 * @type first order function
 * @status stable
 * @example

   const min = x => y => !!x <= !!y ? x : y;

   min(false) (true); // false
   min("foo") (""); // ""
   min("foo") ("bar"); // "foo"


 */


// a -> a -> a
const min = x => y => !!x <= !!y ? x : y;


/**
 * @name maximal value
 * @note works with all types through explicit type cast; commutative
 * @type first order function
 * @status stable
 * @example

   const max = x => y => !!x >= !!y ? x : y;

   max(false) (true); // true
   max("") ("foo"); // "foo"
   max("foo") ("bar"); // "foo"

 */


// a -> a -> a
const max = x => y => !!x >= !!y ? x : y;


// Setoid


/**
 * @name equal
 * @note works with all types through explicit type cast; commutative
 * @type first order function
 * @status stable
 * @example

   const eq = x => y => !!x === !!y;

   eq(false) (false); // true

   // implicit type coercion:

   eq("foo") ("bar"); // true
   eq("foo") (""); // false

 */


// a -> a -> Boolean
const eq = x => y => !!x === !!y;


/**
 * @name not equal
 * @note works with all types through explicit type cast
 * @type first order function
 * @status stable
 * @example

   @see eq

 */


// a -> a -> Boolean
const neq = x => y => !!x !== !!y;


// API


module.exports = Bool;