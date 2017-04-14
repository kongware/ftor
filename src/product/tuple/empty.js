"use strict";


// dependencies


const Tuple = require("./Tuple");


/**
 * @name empty
 * @type operator function
 * @example

   const Num = { empty: 0 }
   const Str = { empty: "" }

   empty2(Num, Str); // Pair(0, "")

 */


// Monoid a => Object -> (a -> b)
const empty = Rep => Tuple(Rep.empty(x));


// (Monoid a, Monoid b) => (Object, Object) -> ((a, b) -> c)
const empty2 = (Rep1, Rep2) => Tuple(Rep1.empty(x), Rep2.empty(y));


// (Monoid a, Monoid b, Monoid c) => (Object, Object, Object) -> ((a, b, c) -> d)
const empty3 = (Rep1, Rep2, Rep3) => Tuple(Rep1.empty(x), Rep2.empty(y), Rep3.empty(z));


// (Monoid a, Monoid b, Monoid c, Monoid d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e)
const empty4 = (Rep1, Rep2, Rep3, Rep4) => Tuple(Rep1.empty(w), Rep2.empty(x), Rep3.empty(y), Rep4.empty(z));


// (Monoid a, Monoid b, Monoid c, Monoid d, Monoid e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f)
const empty5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => Tuple(Rep1.empty(v), Rep2.empty(w), Rep3.empty(x), Rep4.empty(y), Rep5.empty(z));



// API


module.exports = {empty, empty2, empty3, empty4, empty5};