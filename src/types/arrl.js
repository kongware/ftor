"use strict";


/**
 * @name array like
 * @note contract
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// Object -> Object|TypeError String [?]
const arrl = x => x !== null && typeof x === "object" && length in x ? x : Err(TypeError) ("", "array like", typeof x);


// API


module.exports = arrl;