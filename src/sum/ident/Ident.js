"use strict";


/**
 * @name Ident
 * @type unary value constructor
 * @example

   Ident(5); // {type: Ident, x: 5}

 */


// Ident t => a -> t a
const Ident = x => ({type: Ident, x: x});


// API


module.exports = Ident;