"use strict";


/**
 * @name clone
 * @type operator function
 * @example

   ?

 */


// Map|WeakMap|Set|WeakSet -> Map|WeakMap|Set|WeakSet
const clone = cons => t => Reflect.construct(cons, [t]);


// API


module.exports = clone;