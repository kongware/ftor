"use strict";


// dependencies


const Semigroup = require("./Semigroup");
const Tuple = require("./Tuple");


/**
 * @name Monoid type class
 * @type type representative
 * @kind * -> *
 */


const Monoid = Object.assign({}, Semigroup);


/**
 * @name empty
 * @type constant
 * @example

   const Tuple = (...args) => f => f(...args);
   const Pair = (x, y) => f => f(x, y);
   const toArray = (...args) => args;

   const Semigroup = {} // mock
   const Monoid = Object.assign({}, Semigroup);
   Monoid.empty2 = (Rep1, Rep2) => Tuple(Rep1.empty, Rep2.empty);

   const Num = {empty: 0}
   const Str = {empty: ""}

   Monoid.empty2(Num, Str) (toArray); // [0, ""]

 */


// Monoid a => Object -> (a -> b)
Monoid.empty = Rep => Tuple(Rep.empty);


// (Monoid a, Monoid b) => (Object, Object) -> ((a, b) -> c)
Monoid.empty2 = (Rep1, Rep2) => Tuple(Rep1.empty, Rep2.empty);


// (Monoid a, Monoid b, Monoid c) => (Object, Object, Object) -> ((a, b, c) -> d)
Monoid.empty3 = (Rep1, Rep2, Rep3) => Tuple(Rep1.empty, Rep2.empty, Rep3.empty);


// (Monoid a, Monoid b, Monoid c, Monoid d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e)
Monoid.empty4 = (Rep1, Rep2, Rep3, Rep4) => Tuple(Rep1.empty, Rep2.empty, Rep3.empty, Rep4.empty);


// (Monoid a, Monoid b, Monoid c, Monoid d, Monoid e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f)
Monoid.empty5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => Tuple(Rep1.empty, Rep2.empty, Rep3.empty, Rep4.empty, Rep5.empty);


// API


module.exports = Monoid;