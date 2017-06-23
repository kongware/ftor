"use strict";


// dependencies


const throwType = require("../function/throwType");


/**
 * @name date
 * @note contract
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// String -> Date -> Date
const dat = tag => x => Object.prototype.toString.call(x) === "[object Date]" ? x : throwType(`${tag} expects a date (${typeof x} given)`);


// API


module.exports = dat;