"use strict";


// dependencies


const len = require("./len");


/**
 * @name equal
 * @type higher order function
 * @example
 *

   ?

 */


// Object -> (a -> b) -> (a -> b) -> Boolean
const eq = Rep => t2 => t1 => t1(len) === t2(len)
 && t1(x => t2(y => Rep.eq_(x, y)));


// Object -> Object -> ((a, b) -> c) -> ((a, b) -> c) -> Boolean
const eq2 = Rep1 => Rep2 => t2 => t1 => t1(len) === t2(len)
 && t1((w, x) => t2((y, z) => Rep1.eq_(w, y) && Rep2.eq_(x, z)));


// API


module.exports = {eq, eq2};