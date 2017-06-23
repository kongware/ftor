"use strict";


// dependencies


const throwType = require("../function/throwType");


/**
 * @name finite number
 * @note contract
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// String -> Number -> Number
const fnum = tag => x => isFinite(x) ? x : throwType(`${tag} expects a finite number (${typeof x} given)`);


// API


module.exports = fnum;