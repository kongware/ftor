"use strict";


// dependencies


const cons = require("./cons");


/**
 * @name map
 * @type higher order function
 * @example

   map(x => x * x) (cons(5)); // {type: Const, x: 5}

 */


// Const t => (a -> b) -> t a -> t a
const map = f => t => cons(t.x);


// API


module.exports = map;