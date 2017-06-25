"use strict";


// dependencies


const throwType = require("../function/throwType");


/**
 * @name array like
 * @note contract
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// String -> [*] -> [*]
const arrl = tag => x => x !== null && typeof x === "object" && length in x ? x : throwType(`${tag} expects an []-like (${typeof x} given)`);


// API


module.exports = arrl;