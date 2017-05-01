"use strict";


/**
 * @name All
 * @note combined type and constructor; primitive
 * @type type representative
 * @kind *
 * @status stable
 */


// constructor


/**
 * @name All
 * @note lambda to prevent new-operator use
 * @type constructor
 * @status stable
 */


const All = x => Boolean(x);


// catamorphism


/**
 * @name catamorphism
 * @note Boolean list catamorphism; short circuiting; works with all types through implicit type coercion
 * @type higher order function
 * @status stable
 * @example

   const A = f => x => f(x);

   const foldrk = f => acc => xs => {
     const aux = (acc, i) => i < 0
      ? acc
      : f(xs[i]) (acc, i) (acc => aux(acc, i - 1));

     return aux(acc, xs.length - 1);
   };

   const even = x => Math.floor(x) === x && (x & 1) === 0;
   const I = x => x;

   const All = x => Boolean(x);
   All.cata = f => xs => xs.every(A(f));

   All.cata(even) ([2, 4, 6, 8, 10]); // true

   // implicit type coercion:

   All.cata(I) (["foo", "bar", "baz"]); // true
   All.cata(I) (["foo", "", "baz"]); // false

 */


// (a -> b) -> [a] -> Boolean
All.cata = f => xs => xs.every(A(f));


// (a -> b) -> [a] -> Boolean
All.cata_ = f => foldrk(x => _ => k => f(x) && k(true)) (true);


// Semigroup


/**
 * @name concat
 * @note logical conjunction; short circuiting; works with all types through implicit type coercion
 * @type associative binary operation (semigroup)
 * @status stable
 * @example

   const All = x => Boolean(x);
   All.concat = x => y => x && y;

   All.concat(true) (true); // true
   All.concat(true) (false); // false

   All.concat(1) (2); // 2
   All.concat(0) (2); // 0

 */


// a -> a -> a
All.concat = x => y => x && y;


// a -> a -> a
All.concat_ = y => x => x && y;


// Monoid


/**
 * @name empty
 * @type constant
 * @status stable
 * @example

   const foldl = f => acc => xs => xs.reduce((acc, x, i) => f(acc) (x, i), acc);

   const All = x => Boolean(x);
   All.concat = x => y => x && y;
   All.empty = true;

   const fold = foldl(All.concat) (All.empty);

   fold([true, true, true]); // true

 */


// Boolean
All.empty = true;


// API


module.exports = All;