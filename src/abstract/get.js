"use strict";


/**
 * @name get
 * @type operator function
 * @example

   ?

 */


// k -> Map|WeakMap|Set|WeakSet -> v
const get = k => t => t.get(k);


// API


module.exports = get;