"use strict";


// dependencies


const throwType = require("../function/throwType");


/**
 * @name regular expression
 * @note contract
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// String -> RegExp -> RegExp
const reg = tag => x => Object.prototype.toString.call(x) === "[object RegExp]" ? x : throwType(`${tag} expects a regular expression (${typeof x} given)`);


// API


module.exports = reg;