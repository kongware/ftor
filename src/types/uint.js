"use strict";


/**
 * @name unsigned integer
 * @note contract
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// Number -> Number|TypeError String [?]
const int = x => typeof x === "number" && x % 1 === 0 && x >= 0 ? x : Err(TypeError) ("", "unsigned integer", typeof x);


// API


module.exports = uint;