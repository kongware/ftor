"use strict";


// dependencies


const throwType = require("../function/throwType");


/**
 * @name set
 * @note contract
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// String -> Set -> Set
const set = tag => x => Object.prototype.toString.call(x) === "[object Set]" ? x : throwType(`${tag} expects a set (${typeof x} given)`);


// API


module.exports = set;