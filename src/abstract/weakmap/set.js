"use strict";


// dependencies


const clone = require("../clone") (WeakMap);


/**
 * @name set
 * @note set_ is a destructive operation
 * @type operator function
 * @example

   ?

 */


// ((k, v) -> a) -> WeakMap -> WeakMap
const set = pair => weakMap => (weakMap = clone(weakMap), pair(weakMap.set.bind(weakMap)));


// ((k, v) -> a) -> WeakMap -> WeakMap
const set_ = pair => weakMap => pair(weakMap.set.bind(weakMap));


// API


module.exports = {set, set_};