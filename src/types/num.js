"use strict";


// dependencies


const throwType = require("../function/throwType");


/**
 * @name number
 * @note contract
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// String -> Number -> Number
const num = tag => x => typeof x === "number" ? x : throwType(`${tag} expects a number (${typeof x} given)`);


// API


module.exports = num;