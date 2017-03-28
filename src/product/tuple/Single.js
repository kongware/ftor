"use strict";


// dependencies


const {T} = require("../../T");


/**
 * @name single tuple
 * @type unary constructor
 * @example
 *

   Single(1) (x => x + 1); // 2

 */


// a -> (a -> b) -> b
const Single = T;


// API


module.exports = Single;