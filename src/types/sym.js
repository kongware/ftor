"use strict";


/**
 * @name symbol
 * @note contract
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// Symbol -> Symbol|TypeError String [?]
const sym = x => typeof x === "symbol" ? x : Err(TypeError) ("", "symbol", typeof x);


// API


module.exports = sym;