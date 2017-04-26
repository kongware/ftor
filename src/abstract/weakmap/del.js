"use strict";


// dependencies


const clone = require("../clone") (WeakMap);


/**
 * @name del
 * @note del_ is a destructive operation
 * @type first order function
 * @example

   ?

 */


// k -> WeakMap -> WeakMap
const del = k => weakMap => (weakMap = clone(weakMap), weakMap.delete(k), weakMap);


// k -> WeakMap -> WeakMap
const del_ = k => weakMap => (weakMap.delete(k), weakMap);


// API


module.exports = {del, del_};