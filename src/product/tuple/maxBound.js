"use strict";


// dependencies


const Tuple = require("./Tuple");


/**
 * @name maxinmal bounded
 * @type operator function
 * @example

   const Num = { maxBound: Infinity }
   const Chr = { maxBound: "\u{10FFFF}" }

   maxBound2(Num, Chr); // Pair(Infinity, "\u{10FFFF}")

 */


// Bounded a => Object -> (a -> b)
const maxBound = Rep => Tuple(Rep.maxBound);


// (Bounded a, Bounded b) => (Object, Object) -> ((a, b) -> c)
const maxBound2 = (Rep1, Rep2) => Tuple(Rep1.maxBound, Rep2.maxBound);


// (Bounded a, Bounded b, Bounded c) => (Object, Object, Object) -> ((a, b, c) -> d)
const maxBound3 = (Rep1, Rep2, Rep3) => Tuple(Rep1.maxBound, Rep2.maxBound, Rep3.maxBound);


// (Bounded a, Bounded b, Bounded c, Bounded d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e)
const maxBound4 = (Rep1, Rep2, Rep3, Rep4) => Tuple(Rep1.maxBound, Rep2.maxBound, Rep3.maxBound, Rep4.maxBound);


// (Bounded a, Bounded b, Bounded c, Bounded d, Bounded e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f)
const maxBound5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => Tuple(Rep1.maxBound, Rep2.maxBound, Rep3.maxBound, Rep4.maxBound, Rep5.maxBound);


// API


module.exports = {maxBound, maxBound2, maxBound3, maxBound4, maxBound5};