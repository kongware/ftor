"use strict";


// dependencies


const Const = require("./Const");


/**
 * @name map
 * @type higher order function
 * @class Const
 * @example

   const Const_ = {};
   const Const = x => ({type: Const_, x: x});
   const map = f => t => Const(t.x);

   const sqr = x => x * x;
   const const5 = Const(5);

   map(sqr) (const5); // {type: Const_, x: 5}

 */


// Const_ t => (a -> b) -> t a -> t a
const map = f => t => Const(t.x);


// API


module.exports = map;