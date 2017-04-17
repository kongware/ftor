"use strict";


// dependencies


const Ident = require("./Ident");


/**
 * @name map
 * @type higher order function
 * @class Ident
 * @example

   const Ident_ = {};
   const Ident = x => ({type: Ident_, x: x});
   const map = f => t => Ident(f(t.x));

   const sqr = x => x * x;
   const ident5 = Ident(5);

   map(sqr) (ident5); // {type: Ident_, x: 25}

 */


// Ident_ t => (a -> b) -> t a -> t b
const map = f => t => Ident(f(t.x));


// API


module.exports = map;