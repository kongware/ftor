"use strict";


// dependencies


const EQ = require("./EQ");


/**
 * @name empty
 * @type constant function
 * @example

   empty(); // EQ

 */


// () -> Ordering
const empty = () => EQ;


// API


module.exports = empty;