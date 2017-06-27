"use strict";


/**
 * @name boolean
 * @note contract
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// Boolean -> Boolean|TypeError String [?]
const boo = x => typeof x === "boolean" ? x : Err(TypeError) ("", "boolean", typeof x);


// API


module.exports = boo;