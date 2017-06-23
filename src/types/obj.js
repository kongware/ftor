"use strict";


// dependencies


const throwType = require("../function/throwType");


/**
 * @name object
 * @note contract
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// String -> Object -> Object
const obj = tag => x => x !== null && typeof x === "object" ? x : throwType(`${tag} expects an object (${typeof x} given)`);


// API


module.exports = obj;