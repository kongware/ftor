"use strict";


/**
 * @name set
 * @note contract
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// Set ? -> Set ?|TypeError String [?]
const set = x => Object.prototype.toString.call(x) === "[object Set]" ? x : Err(TypeError) ("", "set", typeof x);


// API


module.exports = set;