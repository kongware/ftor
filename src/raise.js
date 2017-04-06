"use strict";


// dependencies


const render = require("./render");


/**
 * @name raise
 * @type impure, variadic function
 * @example
 *

   raise(RangeError) ("${0} developers, ${1} options") (2, 3); // RangeError: 2 developers, 3 options

 */


// (String -> Error) -> String -> (*) -> Error
const raise = cons => template => (...args) => { throw new cons(render(template) (...args)) };


// API


module.exports = raise;