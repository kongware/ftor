"use strict";


// dependencies


const {B_} = require("../B");


/**
 * @name concat map
 * @type higher order function
 * @status stable
 * @example

   @see ../concatMapBy

 */


// (a -> b -> a) -> (a -> [b]) -> [a] -> [b]
const concatMap = f => Array.foldl(B_(Array.concat, f)) ([]);


// API


module.exports = concatMap;