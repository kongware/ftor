"use strict";


/**
 * @name iterator
 * @note contract
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// Iterator -> Iterator|TypeError String [?]
const itor = x => typeof x === "object" && next in x ? x : Err(TypeError) ("", "iterator", typeof x);


// API


module.exports = itor;