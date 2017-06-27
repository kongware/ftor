"use strict";


/**
 * @name function
 * @note contract
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// Function -> Function|TypeError String [?]
const fun = x => typeof x === "function" ? x : Err(TypeError) ("", "function", typeof x);


// API


module.exports = fun;