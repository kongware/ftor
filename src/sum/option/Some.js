"use strict";


// dependencies


const Option = require("./Option");


/**
 * @name Some
 * @type constructor
 * @example

   Some(5); // {type: Option, tag: "Some", x: 5}

 */


// Option t => a -> t a
const Some = x => ({type: Option, tag: "Some", x: x});


// API


module.exports = Some;