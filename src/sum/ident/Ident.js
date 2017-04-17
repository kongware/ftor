"use strict";


// dependencies


const Ident_ = require("./Ident_");


/**
 * @name Identity constructor
 * @type value constructor
 * @example

   const Ident_ = {};
   const Ident = x => ({type: Ident_, x: x});

   Ident(5); // {type: Ident_, x: 5}

 */


// Ident_ t => a -> t a
const Ident = x => ({type: Ident_, x: x});


// API


module.exports = Ident;