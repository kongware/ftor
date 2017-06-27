"use strict";


/**
 * @name promise
 * @note contract
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// Promise a-> Promise a|TypeError String [?]
const pro = x => Object.prototype.toString.call(x) === "[object Promise]" ? x : Err(TypeError) ("", "promise", typeof x);


// API


module.exports = pro;