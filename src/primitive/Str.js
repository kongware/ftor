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


/**
 * @name render
 * @note variadic
 * @type first order function
 * @status stable
 * @example

  const Str = x => String(x);
  Str.render = template => (...args) => template.replace(/\$\{(\d+)}/g, (_, i) => args[i]);
  const template = Str.render("${0} monkeys on ${1} trees");

  template(9, 3); // "9 monkeys on 3 trees"

 */


// String -> (*) -> String
Str.render = template => (...args) => template.replace(/\$\{(\d+)}/g, (_, i) => args[i]);


// API


module.exports = Str;