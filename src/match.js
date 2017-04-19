"use strict";


/**
 * @name pattern matching
 * @type higher order function
 * @example

   const A = f => x => f(x);
   const otherwise = A;

   const match = (...fs) => x => {
     const aux = (r, i) => r !== null ? r
      : i in fs ? aux(fs[i](x), i + 1)
      : null;

     return aux(fs[0](x), 1);
   };

   const pattern = f => x => {
     try {
       return f(x);
     } catch (_) {
       return null;
     }
   };

   const tell = match(
     pattern(([[_]]) => _ === undefined ? "nested empty list" : null),
     pattern(([[x, _]]) => _ === undefined ? "nested single element list" : null),
     pattern(([[x, y]]) => "nested multiple element list"),
     pattern(([_]) => _ === undefined ? "empty list" : null),
     pattern(([x, _]) => _ === undefined ? "single element list" : null),
     pattern(([x, y]) => "multiple element list"),
     otherwise(x => "no list at all")
   );

   tell([[1, 2]]); // "nested multiple element list"
   tell([1]); // "single element list"
   tell([[]]); // "nested empty list"
   tell({}); // "no list at all"

 */


// ((a -> b)) -> a -> b
const match = (...fs) => x => {
  const aux = (r, i) => r !== null ? r
   : i in fs ? aux(fs[i](x), i + 1)
   : null;

  return aux(fs[0](x), 1);
};


// ((a -> b -> c)) -> a -> b -> c
const match2 = (...fs) => x => y => {
  const aux = (r, i) => r !== null ? r
   : i in fs ? aux(fs[i](x) (y), i + 1)
   : null;

  return aux(fs[0](x) (y), 1);
};


// ((a -> b -> c -> d)) -> a -> b -> c -> d
const match3 = (...fs) => x => y => z => {
  const aux = (r, i) => r !== null ? r
   : i in fs ? aux(fs[i](x) (y) (z), i + 1)
   : null;

  return aux(fs[0](x) (y) (z), 1);
};


// API


module.exports = {match, match2, match3};