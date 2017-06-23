"use strict";


// dependencies


const throwType = require("../function/throwType");


/**
 * @name promise
 * @note contract
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// String -> Promise -> Promise
const pro = tag => x => Object.prototype.toString.call(x) === "[object Promise]" ? x : throwType(`${tag} expects a promise (${typeof x} given)`);


// API


module.exports = pro;