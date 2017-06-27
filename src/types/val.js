"use strict";


/**
 * @name value
 * @note contract
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// ?
const val = x => x !== undefined && x !== null ? x : Err(TypeError) ("", "value", typeof x);


// API


module.exports = val;