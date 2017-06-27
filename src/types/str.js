"use strict";


/**
 * @name string
 * @note contract
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// String -> String|TypeError String [?]
const str = x => typeof x === "string" ? x : Err(TypeError) ("", "string", typeof x);


// API


module.exports = str;