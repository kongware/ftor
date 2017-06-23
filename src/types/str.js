"use strict";


// dependencies


const throwType = require("../function/throwType");


/**
 * @name string
 * @note contract
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// String -> String -> String
const str = tag => x => typeof x === "string" ? x : throwType(`${tag} expects a string (${typeof x} given)`);


// API


module.exports = str;