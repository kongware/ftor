"use strict";


/**
 * @name concat
 * @type operator function
 * @example

   ?

 */


// [a] -> [a] -> [a]
const concat = ys => xs => xs.concat(ys);


// [a] -> [a] -> [a]
const concat_ = xs => ys => xs.concat(ys);


// API


module.exports = {concat, concat_};