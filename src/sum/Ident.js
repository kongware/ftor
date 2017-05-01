"use strict";


// dependencies


const {$tag, $Ident} = require("../interop/props");


/**
 * @name Identity
 * @note combined type and constructor; tagged union
 * @type type representative
 * @kind * -> *
 * @status stable
 */


// constructor


/**
 * @name Identity
 * @type constructor
 * @status stable
 */


// Ident t => a -> t a
const Ident = x => ({[$tag]: "Ident", [$Ident]: x});


// Functor


/**
 * @name map
 * @note functor
 * @type higher order function
 * @status stable
 * @example

   const Ident = x => ({type: Ident, x: x});
   Ident.map = f => t => Ident(f(t.x));

   const ident5 = Ident(5);
   const sqr = x => x * x;

   Ident.map(sqr) (ident5); // {type: Ident, x: 25}

 */


// Ident t => (a -> b) -> t a -> t b
Ident.map = f => t => Ident(f(t[$Ident]));


// API


module.exports = Ident;