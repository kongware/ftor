"use strict";


/**
 * @name object
 * @note contract
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// Object -> Object|TypeError String [?]
const obj = x => x !== null && typeof x === "object" ? x : Err(TypeError) ("", "object", typeof x);


// API


module.exports = obj;