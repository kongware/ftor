"use strict";


/**
 * @name get property key by value
 * @type operator function
 * @example
 *

   const o = {x: 1, y: 2, z: 3};
   getk(2) (o); // "y"

 */


// a -> Object -> String
const getk = v => o => Object.keys(o).find(k => o[k] === v);


// API


module.exports = getk;