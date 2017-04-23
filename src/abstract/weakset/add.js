"use strict";


// dependencies


const clone = require("../clone") (WeakSet);


/**
 * @name add
 * @note add_ is a destructive operation
 * @type operator function
 * @example

   ?

 */


// k -> WeakSet -> WeakSet
const add = k => weakSet => clone(weakSet).add(k);


// k -> WeakSet -> WeakSet
const add_ = k => weakSet => weakSet.add(k);


// API


module.exports = {add, add_};