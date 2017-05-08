"use strict";


// dependencies


const {$tag, $x} = require("../global/interop");


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
const Ident = x => ({[$tag]: "Ident", [$x]: x});


// Functor


/**
 * @name map
 * @note functor
 * @type higher order function
 * @status stable
 * @example

   const Ident = x => ({[$tag]: "Ident", [$x]: x});
   Ident.map = f => t => Ident(f(t[$x]));

   const sqr = x => x * x;
   const ident5 = Ident(5);

   Ident.map(sqr) (ident5); // Ident(25)

 */


// Ident t => (a -> b) -> t a -> t b
Ident.map = f => t => Ident(f(t[$x]));


/**
 * @name run
 * @type first order function
 * @status stable
 */


// Ident t => t a -> a
Ident.run = t => t[$x];


// API


module.exports = Ident;