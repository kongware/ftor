"use strict";


// dependencies


const Tuple = require("./Tuple");


/**
 * @name empty
 * @type constant
 * @class Monoid
 * @example

   const Tuple = (...args) => f => f(...args);
   const Pair = (x, y) => f => f(x, y);
   const toArray = (...args) => args;
   const empty2 = (Rep1, Rep2) => Tuple(Rep1.empty, Rep2.empty);

   const Num = {empty: 0}
   const Str = {empty: ""}

   empty2(Num, Str) (toArray); // [0, ""]

 */


// Monoid a => Object -> (a -> b)
const empty = Rep => Tuple(Rep.empty);


// (Monoid a, Monoid b) => (Object, Object) -> ((a, b) -> c)
const empty2 = (Rep1, Rep2) => Tuple(Rep1.empty, Rep2.empty);


// (Monoid a, Monoid b, Monoid c) => (Object, Object, Object) -> ((a, b, c) -> d)
const empty3 = (Rep1, Rep2, Rep3) => Tuple(Rep1.empty, Rep2.empty, Rep3.empty);


// (Monoid a, Monoid b, Monoid c, Monoid d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e)
const empty4 = (Rep1, Rep2, Rep3, Rep4) => Tuple(Rep1.empty, Rep2.empty, Rep3.empty, Rep4.empty);


// (Monoid a, Monoid b, Monoid c, Monoid d, Monoid e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f)
const empty5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => Tuple(Rep1.empty, Rep2.empty, Rep3.empty, Rep4.empty, Rep5.empty);



// API


module.exports = {empty, empty2, empty3, empty4, empty5};