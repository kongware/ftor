"use strict";


// dependencies


const K = require("./K");


/**
 * @name False
 * @type constant constructor
 * @example

   False(true); // false
   False({}); // false

 */


// () -> Boolean
const False = K(false);


// API


module.exports = False;