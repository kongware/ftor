"use strict";


/**
 * @name Character
 * @type unary constructor
 * @example
 *

   Char("a"); // a
   Char("abc"); // a
   Char(1); // undefined
   Char(["a"]); // undefined

 */


// String -> String|undefined
const Char = ({charAt: truthy, 0: char}) => truthy && char;


// API


module.exports = Char;