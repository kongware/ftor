"use strict";


// dependencies


const {$tag, $x} = require("../interop/props");


/**
 * @name Constant
 * @note combined type and constructor; tagged union
 * @type type representative
 * @kind * -> * -> *
 * @status stable
 */


// constructor


/**
 * @name Constant
 * @type constructor
 * @status stable
 */


// Const t => a -> t a
const Const = x => ({[$tag]: "Const", [$x]: x});


// Functor


/**
 * @name map
 * @note functor
 * @type higher order function
 * @status stable
 * @example

   const Const = x => ({[$tag]: "Const", [$x]: x});
   Const.map = f => t => Const(t[$x]);

   const sqr = x => x * x;
   const const5 = Const(5);

   Const.map(sqr) (const5); // Const(5)

 */


// Const t => (a -> b) -> t a -> t a
Const.map = f => t => Const(t[$x]);


/**
 * @name run
 * @type first order function
 * @status stable
 */


// Const t => t a -> a
Const.run = t => t[$x];


// API


module.exports = Const;