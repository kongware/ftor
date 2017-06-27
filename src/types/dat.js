"use strict";


/**
 * @name date
 * @note contract
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// Date -> Date|TypeError String [?]
const dat = x => Object.prototype.toString.call(x) === "[object Date]" ? x : Err(TypeError) ("", "date", typeof x);


// API


module.exports = dat;