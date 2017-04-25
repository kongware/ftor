"use strict";


// dependencies


const render = require("./render");


/**
 * @name raise
 * @type impure, variadic function
 * @example

   ?

 */


// (String -> Error) -> String -> (*) -> Error
const raise = cons => template => (...args) => { throw new cons(render(template) (...args)) };


// API


module.exports = raise;