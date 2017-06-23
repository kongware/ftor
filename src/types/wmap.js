"use strict";


// dependencies


const throwType = require("../function/throwType");


/**
 * @name weak map
 * @note contract
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// String -> WeakMap -> WeakMap
const wmap = tag => x => Object.prototype.toString.call(x) === "[object WeakMap]" ? x : throwType(`${tag} expects a weakmap (${typeof x} given)`);


// API


module.exports = wmap;