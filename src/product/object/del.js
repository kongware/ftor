"use strict";


/**
 * @name delete property
 * @type operator function
 * @example
 *

   const o = {x: 1, y: 2, z: 3}
   const p = del("y") (o); // {x: 1, z: 3}
   o === p // false

 */


// String -> Object -> Object
const del = k => o => {
  const p = Object.assign({}, o);
  delete p[k];
  return p;
}


// (Object, String) -> Object
const del = (o, k) => {
  const p = Object.assign({}, o);
  delete p[k];
  return p;
}


// API


module.exports = {del, del_};