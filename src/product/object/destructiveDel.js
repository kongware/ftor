"use strict";


/**
 * @name delete property destructively
 * @type impure operator function
 * @example
 *

   const o = {x: 1, y: 2, z: 3}
   const p = destructiveDel("y") (o); // {x: 1, z: 3}
   o === p // true

 */


// String -> Object -> Object
const destructiveDel = k => o => (delete o[k], o);


// (Object, String) -> Object
const destructiveDel_ = (o, k) => (delete o[k], o);


// API


module.exports = {destructiveDel, destructiveDel_};