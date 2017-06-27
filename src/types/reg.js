"use strict";


/**
 * @name regular expression
 * @note contract
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// RegExp -> RegExp|TypeError String [?]
const reg = x => Object.prototype.toString.call(x) === "[object RegExp]" ? x : Err(TypeError) ("", "regexp", typeof x);


// API


module.exports = reg;