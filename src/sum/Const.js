"use strict";


// dependencies


const {$tag, $Const} = require("../interop/props");


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
const Const = x => ({[$tag]: "Const", [$Const]: x});


// Functor


/**
 * @name map
 * @note functor
 * @type higher order function
 * @status stable
 * @example

   const Const = x => ({type: Const, x: x});
   Const.map = f => t => Const(t.x);

   const const5 = Const(5);
   const sqr = x => x * x;

   Const.map(sqr) (const5); // {type: Const, x: 5}

 */


// Const t => (a -> b) -> t a -> t a
Const.map = f => t => Const(t[$Const]);


// API


module.exports = Const;