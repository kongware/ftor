"use strict";


/**
 * @name map
 * @note contract
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// Map ? ? -> Map ? ?|TypeError String [?]
const map = x => Object.prototype.toString.call(x) === "[object Map]" ? x : Err(TypeError) ("", "map", typeof x);


// API


module.exports = map;