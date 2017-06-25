"use strict";


// dependencies


const throwType = require("../function/throwType");


/**
 * @name array
 * @note contract
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// String -> [*] -> [*]
const arr = tag => x => Array.isArray(x) ? x : throwType(`${tag} expects an [] (${typeof x} given)`);


// API


module.exports = arr;