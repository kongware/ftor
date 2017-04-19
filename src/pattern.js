"use strict";


/**
 * @name pattern
 * @type safe pattern matching (destrcuturing assignment)
 * @example

   @see match

   const pattern2 = f => x => y => {
     try {
       return f(x) (y);
     } catch (_) {
       return null;
     }
   };

   const addVectors = pattern2(([x1, y1]) => ([x2, y2]) => [x1 + x2, y1 + y2]);

   addVectors([1, 2]) ([1, 2]); // [2, 4]

   // unfortunately, no type safety:
   addVectors([1, 2]) ([]); // [NaN, NaN]
   addVectors([1, 2]) ({}); // null

 */


// (a -> b) -> a -> b
const pattern = f => x => {
  try {
    return f(x);
  } catch (_) {
    return null;
  }
};


// (a -> b -> c) -> a -> b -> c
const pattern2 = f => x => y => {
  try {
    return f(x) (y);
  } catch (_) {
    return null;
  }
};


// (a -> b -> c -> d) -> a -> b -> c -> d
const pattern3 = f => x => y => z => {
  try {
    return f(x) (y) (z);
  } catch (_) {
    return null;
  }
};


// API


module.exports = {pattern, pattern2, pattern3};