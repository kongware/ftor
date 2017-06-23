"use strict";


// dependencies


const throwType = require("../function/throwType");


/**
 * @name value
 * @note contract
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// String -> a -> a
const val = tag => x => x !== undefined && x !== null ? x : throwType(`${tag} expects a value (${typeof x} given)`);


// API


module.exports = val;