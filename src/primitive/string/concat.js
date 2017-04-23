"use strict";


/**
 * @name concat
 * @type operator function
 * @example

   ?

 */


// String -> String -> String
const concat = y => x => x.concat(y);


// String -> String -> String
const concat_ = x => y => x.concat(y);


// API


module.exports = {concat, concat_};