"use strict";


// dependencies


const {render_} = require("./render");


/**
 * @name raise
 * @type impure, variadic function
 * @example
 *

   raise(RangeError) ("${0} developers, ${1} options") (2, 3); // RangeError: 2 developers, 3 options

 */


// Function -> String -> [*] -> String
const raise = cons => template => (...args) => { throw new cons(render_(template, ...args)) };


// (Function -> String, [*]) -> String
const raise_ = (cons, template, ...args) => { throw new cons(render_(template, ...args)) };


// API


module.exports = {raise, raise_};