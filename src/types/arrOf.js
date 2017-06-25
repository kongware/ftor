"use strict";


// dependencies


const throwType = require("../function/throwType");


/**
 * @name array of
 * @note contract
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// (String -> a -> a, String) -> String -> [a] -> [a]
const arrOf = (c, type) => tag => x => Array.isArray(x) ? x.every(y => c(tag) (y))
 ? x : throwType(`${tag} expects an [${type}] ([${typeof x[0]}] given)`)
 : throwType(`${tag} expects an [${type}] (${typeof x} given)`);


// API


module.exports = arrOf;