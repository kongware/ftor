"use strict";


// dependencies


const throwType = require("../function/throwType");


/**
 * @name integer
 * @note contract
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// String -> Number -> Number
const inc = tag => x => typeof x === "number" && x % 1 === 0 ? x : throwType(`${tag} expects an integer (${typeof x} given)`);


// API


module.exports = int;