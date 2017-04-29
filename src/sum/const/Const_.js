"use strict";


// dependencies


const Const = require("./Const");


/**
 * @name Constant type
 * @type type representative
 * @kind * -> * -> *
 */


const Const_ = {};


/**
 * @name map
 * @type higher order function
 * @example

   const Const_ = {};
   Const_.map = f => t => Const(t.x);
   const Const = x => ({type: Const_, x: x});

   const sqr = x => x * x;
   const const5 = Const(5);

   Const_.map(sqr) (const5); // {type: Const_, x: 5}

 */


// Const_ t => (a -> b) -> t a -> t a
Const_.map = f => t => Const(t.x);


// API


module.exports = Const_;