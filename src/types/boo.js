"use strict";


// dependencies


const throwType = require("../function/throwType");


/**
 * @name boolean
 * @note contract
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// String -> Boolean -> Boolean
const boo = tag => x => typeof x === "boolean" ? x : throwType(`${tag} expects a boolean (${typeof x} given)`);


// API


module.exports = boo;