"use strict";


// dependencies


const throwType = require("../function/throwType");


/**
 * @name symbol
 * @note contract
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// String -> Symbol -> Symbol
const sym = tag => x => typeof x === "symbol" ? x : throwType(`${tag} expects a symbol (${typeof x} given)`);


// API


module.exports = sym;