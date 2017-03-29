"use strict";


// dependencies


const clone = require("./clone");
const destructiveDel = require("./destructiveDel");


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
const del = k => o => destructiveDel(k) (clone(o));


// (Object, String) -> Object
const del_ = (o, k) => destructiveDel(k) (clone(o));


// API


module.exports = {del, del_};