"use strict";


// dependencies


const throwType = require("../function/throwType");


/**
 * @name function
 * @note contract
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// String -> Function -> Function
const fun = tag => x => typeof x === "function" ? x : throwType(`${tag} expects a function (${typeof x} given)`);


// API


module.exports = fun;