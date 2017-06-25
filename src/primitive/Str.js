"use strict";


/**
 * @name String
 * @note combined namespace/constructor; lambda to prevent new-operator use
 * @type primitive type
 * @status stable
 */


const Str = x => String(x);


/**
 * @name append
 * @type first order function
 * @status stable
 * @example

  const Str = x => String(x);
  Str.append = y => x => x.concat(y);

  Str.append("foo") ("bar"); // "barfoo"

 */


// String -> String -> String
Str.append = y => x => x.concat(y);


/**
 * @name locale compare
 * @type first order function
 * @status stable
 * @example

  const Str = x => String(x);
  Str.localeCompare = x => y => x.localeCompare(y);

  Str.localeCompare("ä") ("a"); // GT

 */


// String -> String -> Ordering
Str.localeCompare = x => y => x.localeCompare(y);


// Object -> String -> String
Str.interpolate = o => x => x.replace(/\${(\w+)}/g, (_, k) => o[k]);


// String -> String -> Ordering
Str.localeCompare_ = y => x => x.localeCompare(y);


/**
 * @name maximal bound
 * @type first order function
 * @status stable
 */


// Number -> String
Str.maxBound = n => Array(n).fill("\u{10FFFF}").join("");


/**
 * @name minimal bound
 * @type first order function
 * @status stable
 */


// Number -> String
Str.minBound = n => Array(n).fill("\u{0}").join("");


/**
 * @name prepend
 * @type first order function
 * @status stable
 * @example

  const Str = x => String(x);
  Str.prepend = x => y => x.concat(y);

  Str.prepend("foo") ("bar"); // "foobar"

 */


// String -> String -> String
Str.prepend = x => y => x.concat(y);


// API


module.exports = Str;