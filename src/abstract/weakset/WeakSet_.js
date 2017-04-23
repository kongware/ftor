"use strict";


/**
 * @name weakWeakSet
 * @note without new
 * @type data constructor
 * @example

   ?

 */


// [*] -> WeakSet
const WeakSet_ = xs => Reflect.construct(WeakSet, [xs]);


// API


module.exports = WeakSet_;