"use strict";


/**
 * @name render
 * @type variadic operator function
 * @example

   ?

 */


// String -> (*) -> String
const render = template => (...args) => template.replace(/\$\{(\d+)}/g, (_, i) => args[i]);


// API


module.exports = render;