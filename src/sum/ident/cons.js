"use strict";


// dependencies


const Ident = require("./Ident");


/**
 * @name constructor
 * @type unary value constructor
 * @example

   cons(5); // {type: Ident, x: 5}

 */


// Ident t => a -> t a
const cons = x => ({type: Ident, x: x});


// API


module.exports = cons;