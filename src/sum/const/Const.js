"use strict";


/**
 * @name Const
 * @type unary value constructor
 * @example

   Const(5); // {type: Const, x: 5}

 */


// Const t => a -> t a
const Const = x => ({type: Const, x: x});


// API


module.exports = Const;