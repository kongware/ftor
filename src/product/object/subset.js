"use strict";


/**
 * @name subset
 * @type operator function
 * @example
 *

   const o = {x: 1, y: 2, z: 3};
   subset2("x") ("z") (o); // {x: 1, z: 3}

 */


// String -> Object -> Object
const subset = x => ({[x]:a}) => ({[x]:a});


// (String, Object) -> Object
const subset_ = (x, ({[x]:a})) => ({[x]:a});


// String -> String -> Object -> Object
const subset2 = x => y => ({[x]:a, [y]:b}) => ({[x]:a, [y]:b});


// (String, String, Object) -> Object
const subset2_ = (x, y, ({[x]:a, [y]:b})) => ({[x]:a, [y]:b});


// String -> String -> String -> Object -> Object
const subset3 = x => y => z => ({[x]:a, [y]:b, [z]:c}) => ({[x]:a, [y]:b, [z]:c});


// (String, String, String, Object) -> Object
const subset3_ = (x, y, z, ({[x]:a, [y]:b, [z]:c})) => ({[x]:a, [y]:b, [z]:c});


// String -> String -> String -> String -> Object -> Object
const subset4 = w => x => y => z => ({[w]:a, [x]:b, [y]:c, [z]:d}) => ({[w]:a, [x]:b, [y]:c, [z]:d});


// (String, String, String, String, Object) -> Object
const subset4_ = (w, x, y, z, ({[w]:a, [x]:b, [y]:c, [z]:d})) => ({[w]:a, [x]:b, [y]:c, [z]:d});


// String -> String -> String -> String -> String -> Object -> Object
const subset5 = v => w => x => y => z => ({[v]:a, [w]:b, [x]:c, [y]:d, [z]:e}) => ({[v]:a, [w]:b, [x]:c, [y]:d, [z]:e});


// (String, String, String, String, String, Object) -> Object
const subset5_ = (v, w, x, y, z, ({[v]:a, [w]:b, [x]:c, [y]:d, [z]:e})) => ({[v]:a, [w]:b, [x]:c, [y]:d, [z]:e});


// API


module.exports = {subset, subset_, subset2, subset2_, subset3, subset3_, subset4, subset4_, subset5, subset5_};