"use strict";


// dependencies


const Ident = require("./Ident");


/**
 * @name Identity type class
 * @type type representative
 * @kind * -> *
 */


const Ident_ = {};


/**
 * @name map
 * @type higher order function
 * @example

   const Ident_ = {};
   Ident_.map = f => t => Ident(f(t.x));
   const Ident = x => ({type: Ident_, x: x});

   const sqr = x => x * x;
   const ident5 = Ident(5);

   Ident_.map(sqr) (ident5); // {type: Ident_, x: 25}

 */


// Ident_ t => (a -> b) -> t a -> t b
Ident_.map = f => t => Ident(f(t.x));


// API


module.exports = Ident_;