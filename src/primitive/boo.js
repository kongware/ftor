"use strict";


// dependencies


const {compare, compare_} = require("./compare");
const EQ = require("./EQ");
const {K} = require("../K");
const LT = require("./LT");
const GT = require("./GT");



/**
 * @name Boolean
 * @note combined namespace/constructor; lambda to prevent new-operator use
 * @type primitive type
 * @status stable
 */


const Boo = x => Boolean(x);


/**
 * @name and
 * @note short circuiting
 * @type first order function
 * @status stable
 * @example

  const Boo = x => Boolean(x);
  Boo.and = x => y => x && y;

  and(true) (true); // true
  and(1) (2); // 2
  and(0) (2); // 0

 */


// a -> a -> a
Boo.and = x => y => x && y;


// a -> a -> a
Boo.and_ = y => x => x && y;


/**
 * @name compare
 * @note performs an explicit type cast
 * @type first order function
 * @status stable
 * @example

  const Boo = x => Boolean(x);
  Boo.compare = x => y => (x = !!x, y = !!y, compare(x) (y));

  const compare = x => y => x < y ? LT : y < x ? GT : EQ;
  const compare_ = y => x => x < y ? LT : y < x ? GT : EQ;

  const LT = -1;
  const EQ = 0;
  const GT = 1;

  Boo.compare(false) (true); // LT
  Boo.compare(true) (false); // GT
  Boo.compare("foo") ("bar"); // EQ

 */


// a -> a -> Number
Boo.compare = x => y => (x = !!x, y = !!y, compare(x) (y));


// a -> a -> Number
Boo.compare_ = x => y => (x = !!x, y = !!y, compare_(x) (y));


/**
 * @name enumeration from
 * @type first order function
 * @status stable
 * @example

  const Boo = x => Boolean(x);
  Boo.enumFrom = x => x ? [true] : [false, true];

  Boo.enumFrom(false); // [false, true]
  Boo.enumFrom(true); // [true]
  Boo.enumFrom(""); // [false, true]
  Boo.enumFrom("a"); // [true]

 */


// a => [Boolean]
Boo.enumFrom = x => x ? [true] : [false, true];


/**
 * @name equal
 * @note performs an explicit type cast; commutative
 * @type first order function
 * @status stable
 * @example

  const Boo = x => Boolean(x);
  Boo.eq = x => y => !!x === !!y;

  Boo.eq(false) (false); // true
  Boo.eq("foo") ("bar"); // true
  Boo.eq("foo") (""); // false

 */


// a -> a -> Boolean
Boo.eq = x => y => !!x === !!y;


/**
 * @name False
 * @type first order function
 * @status stable
 * @example

  const Boo = x => Boolean(x);
  Boo.False = K(false);
  const K = x => _ => x;

  Boo.False(true); // false

 */


// () -> Boolean
Boo.False = K(false);


/**
 * @name from enumeration
 * @type first order function
 * @status stable
 * @example

  const Boo = x => Boolean(x);
  Boo.fromEnum = x => x ? 1 : 0;

  Boo.fromEnum(false); // 0
  Boo.fromEnum(true); // 1
  Boo.fromEnum(""); // 0
  Boo.fromEnum("foo"); // 1

 */


// a -> Number
Boo.fromEnum = x => x ? 1 : 0;


/**
 * @name greater than
 * @note performs an explicit type cast
 * @type first order function
 * @status stable
 * @example

  @see Boo.lt

 */


// a -> a -> Boolean
Boo.gt = x => y => !!x > !!y;


// a -> a -> Boolean
Boo.gt_ = y => x => !!x > !!y;


/**
 * @name greater than or equal
 * @note performs an explicit type cast
 * @type first order function
 * @status stable
 * @example

  @see Boo.lt

 */


// a -> a -> Boolean
Boo.gte = x => y => !!x >= !!y;


// a -> a -> Boolean
Boo.gte_ = y => x => !!x >= !!y;


/**
 * @name implies
 * @note logical implication: if x is true y must be true, otherwise y can be everything
 * @type first order function
 * @status stable
 * @example

  const Boo = x => Boolean(x);
  Boo.implies = x => y => !x || y;

  Boo.implies(true) (true); // true
  Boo.implies(true) (false); // false
  Boo.implies(false) (true); // true
  Boo.implies(false) (false); // true

 */


// Boolean -> Boolean -> Boolean
Boo.implies = x => y => !x || y;


// Boolean -> Boolean -> Boolean
Boo.implies_ = y => x => !x || y;


/**
 * @name lower than
 * @note performs an explicit type cast
 * @type first order function
 * @status stable
 * @example

  const Boo = x => Boolean(x);
  Boo.lt = x => y => !!x < !!y;

  Boo.lt(false) (true); // true
  Boo.lt("foo") (""); // false
  Boo.lt("foo") ("bar"); // false

 */


// a -> a -> Boolean
Boo.lt = x => y => !!x < !!y;


// a -> a -> Boolean
Boo.lt_ = y => x => !!x < !!y;


/**
 * @name lower than or equal
 * @note performs an explicit type cast
 * @type first order function
 * @status stable
 * @example

  @see Boo.lt

 */


// a -> a -> Boolean
Boo.lte = x => y => !!x <= !!y;


// a -> a -> Boolean
Boo.lte_ = y => x => !!x <= !!y;


/**
 * @name maximal value
 * @note performs an explicit type cast; commutative
 * @type first order function
 * @status stable
 * @example

  const Boo = x => Boolean(x);
  Boo.max = x => y => !!x >= !!y ? x : y;

  Boo.max(false) (true); // true
  Boo.max("") ("foo"); // "foo"
  Boo.max("foo") ("bar"); // "foo"

 */


// a -> a -> a
Boo.max = x => y => !!x >= !!y ? x : y;


/**
 * @name maximal bound
 * @type constant
 * @status stable
 */


// Boolean
Boo.maxBound = true


/**
 * @name minimal bound
 * @type constant
 * @status stable
 */


/**
 * @name minimal value
 * @note performs an explicit type cast; commutative
 * @type first order function
 * @status stable
 * @example

  @see Boo.max

 */


// a -> a -> a
Boo.min = x => y => !!x <= !!y ? x : y;


// Boolean
Boo.minBound = false


/**
 * @name not
 * @type first order function
 * @status stable
 * @example

  const Boo = x => Boolean(x);
  Boo.not = x => !x;

  not(true); // false
  not(""); // true

 */


// a -> Boolean
Boo.not = x => !x;


/**
 * @name not predicate
 * @type higher order function
 * @status stable
 * @example

  const Boo = x => Boolean(x);
  Boo.notp2 = pred => x => y => !pred(x) (y);

  const eq = x => y => x === y;
  Boo.notp2(eq) ("foo") ("bar"); // true

 */


// (a -> Boolean) -> a -> Boolean
Boo.notp = pred => x => !pred(x);


// (a -> b -> Boolean) -> a -> b -> Boolean
Boo.notp2 = pred => x => y => !pred(x) (y);


// (a -> b -> c -> Boolean) -> a -> b -> c -> Boolean
Boo.notp3 = pred => x => y => z => !pred(x) (y) (z);


/**
 * @name or
 * @note short circuiting
 * @type first order function
 * @status stable
 * @example

  const Boo = x => Boolean(x);
  Boo.or = x => y => x || y;

  or(false) (true); // true
  or(0) (2); // 2
  or(1) (2); // 1

 */


// a -> a -> a
Boo.or = x => y => x || y;


// a -> a -> a
Boo.or_ = y => x => x || y;


/**
 * @name predecessor
 * @type first order function
 * @status stable
 * @example

  @see succ

 */


// a -> Boolean|null
Boo.pred = x => x ? false : null;


/**
 * @name successor
 * @type first order function
 * @status stable
 * @example

  const Boo = x => Boolean(x);
  Boo.succ = x => x ? null : true;

  Boo.succ(false); // true
  Boo.succ(true); // null

 */


// a -> Boolean|null
Boo.succ = x => x ? null : true;


/**
 * @name to enumeration
 * @type first order function
 * @status stable
 * @example

  const Boo = x => Boolean(x);
  Boo.toEnum = Boo;
  
  Boo.toEnum("foo"); // true
  Boo.toEnum(""); // false

 */


// a -> Boolean
Boo.toEnum = Boo;


/**
 * @name True
 * @type first order function
 * @status stable
 * @example

  const Boo = x => Boolean(x);
  Boo.True = K(true);
  const K = x => _ => x;
  
  Boo.True(false); // true

 */


// () -> Boolean
Boo.True = K(true);


/**
 * @name exclusive or
 * @note logical inequality
 * @type first order function
 * @status stable
 * @example

  const Boo = x => Boolean(x);
  Boo.xor = x => y => x === y ? false : x ? x : y;

  Boo.xor(true) (true); // false
  Boo.xor(true) (false); // true
  Boo.xor(false) (true); // true
  Boo.xor(false) (false); // false
  Boo.xor("a") (""); // "a"
  Boo.xor("a") ("b"); // false

 */


// Boolean -> Boolean -> Boolean
Boo.xor = x => y => !x === !y ? false : x ? x : y;


// API


module.exports = Boo;