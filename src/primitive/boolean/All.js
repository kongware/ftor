"use strict";


// dependencies


const {and, and_} = require("./and");


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
 * @name all
 * @note boolean list catamorphism; short circuiting; performs an implicit type coercion
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
   All.all = f => xs => xs.every(A(f));

   All.all(even) ([2, 4, 6, 8, 10]); // true
   All.all(I) (["foo", "bar", "baz"]); // true
   All.all(I) (["foo", "", "baz"]); // false

 */


// (a -> b) -> [a] -> Boolean
All.all = f => xs => xs.every(A(f));


// (a -> b) -> [a] -> Boolean
All.all_ = f => foldrk(x => _ => k => f(x) && k(true)) (true);


/**
 * @name all by
 * @note boolean catamorphism; short circuiting; performs an implicit type coercion
 * @type higher order function
 * @status unstable
 * @example

   ?

 */


// Foldable t => Object -> (a -> b) -> t a -> Boolean
All.allBy = Rep => f => Rep.foldlk(_ => y => k => f(y) && k(true)) (true);


// Foldable t => Object -> (a -> b) -> t a -> Boolean
All.allBy_ = Rep => f => Rep.foldrk(x => _ => k => f(x) && k(true)) (true);


// Semigroup


/**
 * @name concat
 * @note logical conjunction; short circuiting; performs an implicit type coercion
 * @type associative binary operation (semigroup)
 * @status stable
 * @example

   const and = x => y => x && y;

   const All = x => Boolean(x);
   All.concat = and;

   All.concat(true) (true); // true
   All.concat(true) (false); // false

   All.concat(1) (2); // 2
   All.concat(0) (2); // 0

 */


// a -> a -> a
All.concat = and;


// a -> a -> a
All.concat_ = and_


// Monoid


/**
 * @name empty
 * @type constant
 * @status stable
 * @example

   const foldl = f => acc => xs => xs.reduce((acc, x, i) => f(acc) (x, i), acc);
   const and = x => y => x && y;

   const All = x => Boolean(x);
   All.concat = and;
   All.empty = true;

   const fold = foldl(All.concat) (All.empty);

   fold([true, true, true]); // true

 */


// Boolean
All.empty = true;


// API


module.exports = All;