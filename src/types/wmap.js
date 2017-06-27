"use strict";


/**
 * @name weak map
 * @note contract
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// WeakMap ? ? -> WeakMap ? ?|TypeError String [?]
const wmap = x => Object.prototype.toString.call(x) === "[object WeakMap]" ? x : Err(TypeError) ("", "weakmap", typeof x);


// API


module.exports = wmap;