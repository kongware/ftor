"use strict";


/**
 * @name concat
 * @type first order function
 * @example

   ?

 */


// String -> String -> String
const concat = x => y => x.concat(y);


// String -> String -> String
const concat_ = y => x => x.concat(y);


// API


module.exports = {concat, concat_};