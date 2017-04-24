"use strict";


/**
 * @name logical and
 * @note short circuiting
 * @type operator function
 * @example

   const and_ = x => y => x && y;

   and_(false) ("foo"); // false
   and_("foo") (false); // false
   and_(true) ("foo"); // "foo"
   and_("foo") (true); // true

 */


// a -> b -> a|b
const and = y => x => x && y;


// a -> b -> a|b
const and_ = x => y => x && y;


// API


module.exports = {and, and_};