"use strict";


/**
 * @name array
 * @note contract
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// Array -> Array|TypeError String [?]
const arr = x => Array.isArray(x) ? x : Err(TypeError) ("", "array", typeof x);


// API


module.exports = arr;