"use strict";


/**
 * @name contains value
 * @type operator function
 * @example
 *

   const o = {x: 1, y: 2, z: 3}
   contains(2) (o); // true

 */


// a -> Object -> Boolean
const contains = x => o => Object.keys(o).some(k => o[k] === x);


// (Object, a) -> Boolean
const contains_ = (o, a) => Object.keys(o).some(k => o[k] === x);


// API


module.exports = {contains, contains_};