"use strict";


// dependencies


const {or, or_} = require("./or");


/**
 * @name Any
 * @note combined type and constructor; primitive
 * @type type representative
 * @kind *
 * @status stable
 */


// constructor


/**
 * @name Any
 * @note lambda to prevent new-operator use
 * @type constructor
 * @status stable
 */


const Any = x => Boolean(x);


// catamorphism


/**
 * @name any
 * @note Boolean list catamorphism; short circuiting; performs an implicit type coercion
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

   const Any = x => Boolean(x);
   Any.any = f => xs => xs.some(A(f));

   Any.any(even) ([1, 2, 3, 5]); // true
   Any.any(I) (["", "", ""]); // false
   Any.any(I) (["foo", "", ""]); // true

 */


// (a -> b) -> [a] -> Boolean
Any.cata = f => xs => xs.some(A(f));


// (a -> b) -> [a] -> Boolean
Any.cata_ = f => foldrk(x => _ => k => f(x) || k(false)) (false);


/**
 * @name any by
 * @note Boolean catamorphism; short circuiting; performs an implicit type coercion
 * @type higher order function
 * @status unstable
 * @example

   ?

 */


// Foldable t => Object -> (a -> b) -> t a -> Boolean
Any.anyBy = Rep => f => Rep.foldlk(_ => y => k => f(y) || k(false)) (false);


// Foldable t => Object -> (a -> b) -> t a -> Boolean
Any.anyBy_ = Rep => f => Rep.foldrk(x => _ => k => f(x) || k(false)) (false);


// Semigroup


/**
 * @name concat
 * @note logical disjunction; short circuiting; performs an implicit type coercion
 * @type associative binary operation (semigroup)
 * @status stable
 * @example

   const or = x => y => x || y;

   const Any = x => Boolean(x);
   Any.concat = or;

   Any.concat(false) (true); // true
   Any.concat(false) (false); // false

   Any.concat(0) (2); // 2
   Any.concat(1) (2); // 1

 */


// a -> a -> a
Any.concat = or;


// a -> a -> a
Any.concat_ = or_;


// Monoid


/**
 * @name empty
 * @type constant
 * @status stable
 * @example

   const foldl = f => acc => xs => xs.reduce((acc, x, i) => f(acc) (x, i), acc);
   const or = x => y => x || y;

   const Any = {};
   Any.concat = or;
   Any.empty = false;

   const fold = foldl(Any.concat) (Any.empty);

   fold([false, true, false]); // true

 */


// Boolean
Any.empty = false;


// API


module.exports = Any;