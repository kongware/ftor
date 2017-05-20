"use strict";


/**
 * @name Number
 * @note combined namespace/constructor; lambda to prevent new-operator use
 * @type primitive type
 * @status stable
 */


const Num = x => Number(x);


/**
 * @name add
 * @type first order function
 * @status stable
 * @example

  const Num = x => Number(x);
  Num.add = x => y => x + y;
  const add2 = Num.add(2);

  add2(3); // 5

 */


// Number -> Number -> Number
Num.add = x => y => x + y;


/**
 * @name ceil
 * @type first order function
 * @status stable
 * @example

  const Num = x => Number(x);
  Num.ceil = Math.ceil;

  Num.ceil(1.5); // 2

 */


// Number -> Number
Num.ceil = Math.ceil;


/**
 * @name double
 * @type first order function
 * @status stable
 * @example

  const Num = x => Number(x);
  Num.dbl = x => x * 2;

  Num.dbl(5); // 10

 */


// Number -> Number -> Number
Num.dbl = x => x * 2;


/**
 * @name decrease
 * @type first order function
 * @status stable
 * @example

  const Num = x => Number(x);
  Num.dec = x => x - 1;

  Num.dec(3); // 2

 */


// Number -> Number
Num.dec = x => x - 1;


/**
 * @name divide
 * @type first order function
 * @status stable
 * @example

  const Num = x => Number(x);
  Num.div_ = y => x => x / y;
  const div2 = Num.div_(2);

  div2(10); // 5

 */


// Number -> Number -> Number
Num.div = x => y => x / y;


// Number -> Number -> Number
Num.div_ = y => x => x / y;


/**
 * @name even
 * @type first order function
 * @status stable
 * @example

  const Num = x => Number(x);
  Num.even = x => Math.floor(x) === x && (x & 1) === 0;

  Num.even(2); // true
  Num.even(3); // false

 */


// Number -> Boolean
Num.even = x => Math.floor(x) === x && (x & 1) === 0;


/**
 * @name floor
 * @type first order function
 * @status stable
 * @example

  const Num = x => Number(x);
  Num.floor = Math.floor;

  Num.floor(1.5); // 1

 */


// Number -> Number
Num.floor = Math.floor;


/**
 * @name increase
 * @type first order function
 * @status stable
 * @example

  @see Num.dec

 */


// Number -> Number
Num.inc = x => x + 1;


/**
 * @name modulo
 * @type first order function
 * @status stable
 * @example

  const Num = x => Number(x);
  Num.mod_ = y => x => x % y;
  const mod2 = Num.mod_(2);

  mod2(5); // 1

 */


// Number -> Number -> Number
Num.mod = x => y => x % y;


// Number -> Number -> Number
Num.mod_ = y => x => x % y;


/**
 * @name multiply
 * @type first order function
 * @status stable
 * @example

  const Num = x => Number(x);
  Num.mul = x => y => x * y;
  const mul2 = Num.mul(2);

  mul2(5); // 10

 */


// Number -> Number -> Number
Num.mul = x => y => x * y;


/**
 * @name negate
 * @type first order function
 * @status stable
 * @example

  const Num = x => Number(x);
  Num.neg = x => -x;
  
  Num.neg(2); // -2
  Num.neg(-2); // 2

 */


Num.neg = x => -x;


/**
 * @name odd
 * @type first order function
 * @status stable
 * @example

  @see even

 */


// Number -> Boolean
Num.odd = x => Math.floor(x) === x && x & 1 === 1;


/**
 * @name subtract
 * @type first order function
 * @status stable
 * @example

  const Num = x => Number(x);
  Num.sub_ = y => x => x - y;
  const sub2 = Num.sub_(2);

  sub2(5); // 3

 */


// Number -> Number -> Number
Num.sub = x => y => x - y;


// Number -> Number -> Number
Num.sub_ = y => x => x - y;


// API


module.exports = Num;