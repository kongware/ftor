"use strict";


// dependencies


const cons = require("./cons");


/**
 * @name map
 * @type higher order function
 * @example

   map(x => x * x) (cons(5)); // {type: Ident, x: 25}

 */


// Ident t => (a -> b) -> t a -> t b
const map = f => t => cons(f(t.x));


// API


module.exports = map;