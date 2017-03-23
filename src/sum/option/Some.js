"use strict";


// dependencies


const Option = require("./Option");


/**
 * @name Some
 * @type unary constructor
 * @example

   Some(5); // {type: Option, tag: "Some", x: 5}

 */


// a -> Option
const Some = x => ({type: Option, tag: "Some", x: x});


// API


module.exports = Some;