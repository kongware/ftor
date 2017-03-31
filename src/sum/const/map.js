"use strict";


// dependencies


const Const = require("./Const");


/**
 * @name map
 * @type higher order function
 * @example

   map(x => x * x) (Const(5)); // {type: Const, x: 5}

 */


// Const t => (a -> b) -> t a -> t a
const map = f => t => Const(t.x);


// API


module.exports = map;