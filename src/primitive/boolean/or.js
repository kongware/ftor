"use strict";


/**
 * @name logical or
 * @note short circuiting
 * @type operator function
 * @example

   const or_ = x => y => x || y;

   or_(false) ("foo"); // "foo"
   or_("foo") (false); // "foo"
   or_(true) ("foo"); // true
   or_("foo") (true); // "foo"

 */


// a -> b -> a|b
const or = y => x => x || y;


// a -> b -> a|b
const or_ = x => y => x || y;


// API


module.exports = {or, or_};