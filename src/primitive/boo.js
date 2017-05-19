"use strict";


// dependencies


const {K} = require("../K");


/**
 * @name Boolean
 * @note combined namespace/constructor
 * @type primitive type
 * @status stable
 */


const Boo = Boolean;


/**
 * @name False
 * @type first order function
 * @status stable
 * @example

  const K = x => _ => x;
  const False = K(false);

  False(true); // false

 */


// () -> Boolean
Boo.False = K(false);


/**
 * @name True
 * @type first order function
 * @status stable
 * @example

  const K = x => _ => x;
  const True = K(true);
   
  True(false); // true

 */


// () -> Boolean
Boo.True = K(true);



/**
 * @name not predicate
 * @type higher order function
 * @status stable
 * @example

   const Boo = Boolean;
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


// API


module.exports = Boo;