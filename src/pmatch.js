"use strict";


/**
 * @name pattern matching
 * @type higher order function
 * @example
 *

   const K = x => _ => x;
   const I = x => x;
   const otherwise = K;
   const caseOf_ = (f, y) => x => (x === true || null) && f(y);

   const checkType = pmatch(
     ({length: len}) => caseOf_(I, "empty array") (len === 0),

     ({length: len, "0": [x]}) => caseOf_(I, "nested empty array") (len === 1 && x === undefined),

     ({length: len, "0": [x]}) => caseOf_(I, "nested single element array") (len === 1 && x !== undefined),
    
     ({length: len}) => caseOf_(I, "flat single element array") (len === 1),

     ([[x]]) => caseOf_(I, "nested multiple element array") (x !== undefined),

     ({length: len}) => caseOf_(I, "flat multiple element array") (len > 1),

     otherwise("no match at all")
   );

   checkType([[1], [2], [3]]); // "nested multiple element array"
   checkType([1]); // "flat single element array"
   checkType({}); // "no match at all"

 */


// ?
const pmatch = (...fs) => x => {
  let y = null;

  fs.some(f => {
    try {
      y = f(x);
      return y !== null;
    }

    catch (_) { return false }
  });

  if (y === null) throw new TypeError("invalid pattern matching");

  return y;
};


// API


module.exports = pmatch;