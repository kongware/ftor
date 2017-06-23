"use strict";


// dependencies


const throwType = require("../function/throwType");


/**
 * @name map
 * @note contract
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// String -> Map -> Map
const map = tag => x => Object.prototype.toString.call(x) === "[object Map]" ? x : throwType(`${tag} expects a map (${typeof x} given)`);


// API


module.exports = map;