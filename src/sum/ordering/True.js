"use strict";


// dependencies


const K = require("../../K");


/**
 * @name True
 * @type nullary constructor
 * @example

   True(false); // true
   True(null); // true

 */


// () -> Boolean
const True = K(true);


// API


module.exports = True;