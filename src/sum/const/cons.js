"use strict";


// dependencies


const Const = require("./Const");


/**
 * @name constructor
 * @type unary value constructor
 * @example

   cons(5); // {type: Const, x: 5}

 */


// Const t => a -> t a
const cons = x => ({type: Const, x: x});


// API


module.exports = cons;