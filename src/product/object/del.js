"use strict";


/**
 * @name delete a property
 * @type first order function
 * @example
 *

   const o = {x: 1, y: 2, z: 3}
   const p = del("y") (o); // {x: 1, z: 3}
   console.assert(o !== p); // passes

 */


// String -> Object -> Object
const del = k => o => {
  const p = Object.assign({}, o);
  delete p[k];
  return p;
}


// API


module.exports = del;