"use strict";


/**
 * @name Bool
 * @note combined type and constructor
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
Bool.maxBound = true


// Enum


/**
 * @name successor
 * @note performs an implicit type coercion
 * @type first order function
 * @status stable
 * @example

   const Bool = x => Boolean(x);
   Bool.succ = x => x ? null : true;

   Bool.succ(false); // true
   Bool.succ(true); // null

 */


// a -> Boolean|null
Bool.succ = x => x ? null : true;


/**
 * @name predecessor
 * @note performs an implicit type coercion
 * @type first order function
 * @status stable
 * @example

   @see succ

 */


// a -> Boolean|null
Bool.pred = x => x ? false : null;


/**
 * @name toEnum
 * @note performs an implicit type coercion
 * @type first order function
 * @status stable
 * @example

   const Bool = x => Boolean(x);
   Bool.toEnum = Bool;
   
   Bool.toEnum("foo"); // true
   Bool.toEnum(""); // false

 */


// a -> Boolean
Bool.toEnum = Bool;


/**
 * @name from enumeration
 * @note performs an implicit type coercion
 * @type first order function
 * @status stable
 * @example

   const Bool = x => Boolean(x);
   Bool.fromEnum = x => x ? 1 : 0;

   Bool.fromEnum(false); // 0
   Bool.fromEnum(true); // 1
   Bool.fromEnum(""); // 0
   Bool.fromEnum("foo"); // 1

 */


// a -> Number
Bool.fromEnum = x => x ? 1 : 0;


/**
 * @name enumeration from
 * @note performs an implicit type coercion
 * @type first order function
 * @status stable
 * @example

   const Bool = x => Boolean(x);
   Bool.succ = x => x ? null : true;
   Bool.toEnum = Bool;

   Bool.enumFrom = x => {
     const aux = (x, acc) => x === null
      ? acc
      : aux(Bool.succ(x), acc.concat(x));

     return aux(Bool.toEnum(x), []);
   };

   Bool.enumFrom(false); // [false, true]
   Bool.enumFrom(true); // [true]
   Bool.enumFrom(0); // [false, true]
   Bool.enumFrom(7); // [true]

 */


// a => [Boolean]
Bool.enumFrom = x => {
  const aux = (x, acc) => x === null
   ? acc
   : aux(Bool.succ(x), acc.concat(x));

  return aux(Bool.toEnum(x), []);
};


// Ord


/**
 * @name compare
 * @note performs an explicit type cast
 * @type first order function
 * @status stable
 * @example

   const Ordering = {};
   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   const Bool = x => Boolean(x);

   Bool.compare = x => y => {
     x = !!x;
     y = !!y;

     return x < y ? LT
      : x > y ? GT
      : EQ;
   };

   Bool.compare(false) (true); // LT
   Bool.compare(true) (false); // GT
   Bool.compare("foo") ("bar"); // EQ

 */


// a -> a -> Ordering
Bool.compare = x => y => {
  x = !!x;
  y = !!y;

  return x < y ? LT
   : x > y ? GT
   : EQ;
};


// a -> a -> Ordering
Bool.compare_ = y => x => {
  x = !!x;
  y = !!y;

  return x < y ? LT
   : x > y ? GT
   : EQ;
};


/**
 * @name lower than
 * @note performs an explicit type cast
 * @type first order function
 * @status stable
 * @example

   const Bool = x => Boolean(x);
   Bool.lt = x => y => !!x < !!y;

   Bool.lt(false) (true); // true
   Bool.lt("foo") (""); // false
   Bool.lt("foo") ("bar"); // false

 */


// a -> a -> Boolean
Bool.lt = x => y => !!x < !!y;


// a -> a -> Boolean
Bool.lt_ = y => x => !!x < !!y;


/**
 * @name lower than or equal
 * @note performs an explicit type cast
 * @type first order function
 * @status stable
 * @example

   const Bool = x => Boolean(x);
   Bool.lte = x => y => !!x <= !!y;

   Bool.lte(false) (true); // true
   Bool.lte("foo") (""); // false
   Bool.lte("foo") ("bar"); // true

 */


// a -> a -> Boolean
Bool.lte = x => y => !!x <= !!y;


// a -> a -> Boolean
Bool.lte_ = y => x => !!x <= !!y;


/**
 * @name greater than
 * @note performs an explicit type cast
 * @type first order function
 * @status stable
 * @example

   @see lt

 */


// a -> a -> Boolean
Bool.gt = x => y => !!x > !!y;


// a -> a -> Boolean
Bool.gt_ = y => x => !!x > !!y;


/**
 * @name greater than or equal
 * @note performs an explicit type cast
 * @type first order function
 * @status stable
 * @example

   @see lte

 */


// a -> a -> Boolean
Bool.gte = x => y => !!x >= !!y;


// a -> a -> Boolean
Bool.gte_ = y => x => !!x >= !!y;


/**
 * @name minimal value
 * @note performs an explicit type cast; commutative
 * @type first order function
 * @status stable
 * @example

   const Bool = x => Boolean(x);
   Bool.min = x => y => !!x <= !!y ? x : y;

   Bool.min(false) (true); // false
   Bool.min("foo") (""); // ""
   Bool.min("foo") ("bar"); // "foo"

 */


// a -> a -> a
Bool.min = x => y => !!x <= !!y ? x : y;


/**
 * @name maximal value
 * @note performs an explicit type cast; commutative
 * @type first order function
 * @status stable
 * @example

   @see min

 */


// a -> a -> a
Bool.max = x => y => !!x >= !!y ? x : y;


// Setoid


/**
 * @name equal
 * @note performs an explicit type cast; commutative
 * @type first order function
 * @status stable
 * @example

   const Bool = x => Boolean(x);
   Bool.eq = x => y => !!x === !!y;

   Bool.eq(false) (false); // true
   Bool.eq("foo") ("bar"); // true
   Bool.eq("foo") (""); // false

 */


// a -> a -> Boolean
Bool.eq = x => y => !!x === !!y;


/**
 * @name not equal
 * @note performs an explicit type cast
 * @type first order function
 * @status stable
 * @example

   @see eq

 */


// a -> a -> Boolean
Bool.neq = x => y => !!x !== !!y;


// API


module.exports = Bool;