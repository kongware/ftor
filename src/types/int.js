"use strict";


/**
 * @name integer
 * @note contract
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// Number -> Number|TypeError String [?]
const int = x => typeof x === "number" && x % 1 === 0 ? x : Err(TypeError) ("", "integer", typeof x);


// API


module.exports = int;