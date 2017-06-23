"use strict";


// dependencies


const throwType = require("../function/throwType");


/**
 * @name iterator
 * @note contract
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// String -> Iterator -> Iterator
const itor = tag => x => typeof x === "object" && next in x ? x : throwType(`${tag} expects an iterator (${typeof x} given)`);


// API


module.exports = itor;