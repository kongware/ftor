"use strict";


// dependencies


const Const_ = require("./Const_");


/**
 * @name Constant
 * @type value constructor
 * @example

   const Const = x => ({type: Const_, x: x});
   Const(5); // {type: Const_, x: 5}

 */


// Const_ t => a -> t a
const Const = x => ({type: Const_, x: x});


// API


module.exports = Const;