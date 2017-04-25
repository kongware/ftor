"use strict";


/**
 * @name concat
 * @type operator function
 * @example

   ?

 */


// [a] -> [a] -> [a]
const concat = xs => ys => xs.concat(ys);


// [a] -> [a] -> [a]
const concat_ = ys => xs => xs.concat(ys);


// API


module.exports = {concat, concat_};