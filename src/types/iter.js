"use strict";


// dependencies


const throwType = require("../function/throwType");


/**
 * @name iterable
 * @note contract
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// String -> Iterable -> Iterable
const iter = tag => x => typeof x === "object" && Symbol.iterator in x ? x : throwType(`${tag} expects an iterable (${typeof x} given)`);


// API


module.exports = iter;