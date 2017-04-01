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


// (Object, a) -> String
const getk_ = (o, v) => Object.keys(o).find(k => o[k] === v);


// API


module.exports = {getk, getk_};