"use strict";


/**
 * @name weak set
 * @note contract
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// WeakSet ? -> WeakSet ?|TypeError String [?]
const wset = x => Object.prototype.toString.call(x) === "[object WeakSet]" ? x : Err(TypeError) ("", "weakset", typeof x);


// API


module.exports = wset;