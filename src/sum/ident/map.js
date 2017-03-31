"use strict";


// dependencies


const Ident = require("./Ident");


/**
 * @name map
 * @type operator function
 * @example

   map(x => x * x) (Ident(5)); // {type: Ident, x: 25}

 */


// Ident t => (a -> b) -> t a -> t b
const map = f => t => Ident(f(t.x));


// API


module.exports = map;