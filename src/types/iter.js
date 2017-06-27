"use strict";


/**
 * @name iterable
 * @note contract
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// Iterable -> Iterable|TypeError String [?]
const iter = x => typeof x === "object" && Symbol.iterator in x ? x : Err(TypeError) ("", "iterable", typeof x);


// API


module.exports = iter;