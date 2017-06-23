"use strict";


// dependencies


const throwType = require("../function/throwType");


/**
 * @name weak set
 * @note contract
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// String -> WeakSet -> WeakSet
const wset = tag => x => Object.prototype.toString.call(x) === "[object WeakSet]" ? x : throwType(`${tag} expects a weakset (${typeof x} given)`);


// API


module.exports = wset;