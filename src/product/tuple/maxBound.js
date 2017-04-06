"use strict";


// dependencies


const Single = require("./Single");
const Pair = require("./Pair");
const Triplet = require("./Triplet");
const Tuple4 = require("./Tuple4");
const Tuple5 = require("./Tuple5");


/**
 * @name maxinmal bounded Single
 * @type operator function
 * @example
 *

   const Num = {maxBound: Infinity};
   const Boo = {maxBound: true};
   const Chr = {maxBound: "\u{10FFFF}"}
   maxBound3(Num) (Boo) (Chr) (x => _ => _ => x); // Infinity
   maxBound3(Num) (Boo) (Chr) (_ => y => _ => y); // true
   maxBound3(Num) (Boo) (Chr) (_ => _ => z => z); // "\u{10FFFF}"

 */


// Bounded a => Object -> (a -> b)
const maxBound = Rep => Single(Rep.maxBound);


// (Bounded a, Bounded b) => Object -> Object -> ((a, b) -> c)
const maxBound2 = Rep1 => Rep2 => Pair(Rep1.maxBound, Rep2.maxBound);


// (Bounded a, Bounded b, Bounded c) => Object -> Object -> Object -> ((a, b, c) -> d)
const maxBound3 = Rep1 => Rep2 => Rep3 => Pair(Rep1.maxBound, Rep2.maxBound, Rep3.maxBound);


// (Bounded a, Bounded b, Bounded c, Bounded d) => Object -> Object -> Object -> Object -> ((a, b, c, d) -> e)
const maxBound4 = Rep1 => Rep2 => Rep3 => Rep4 => Pair(Rep1.maxBound, Rep2.maxBound, Rep3.maxBound, Rep4.maxBound);


// (Bounded a, Bounded b, Bounded c, Bounded d, Bounded e) => Object -> Object -> Object -> Object -> Object -> ((a, b, c, d, e) -> f)
const maxBound5 = Rep1 => Rep2 => Rep3 => Rep4 => Rep5 => Pair(Rep1.maxBound, Rep2.maxBound, Rep3.maxBound, Rep4.maxBound, Rep5.maxBound);


// API


module.exports = {maxBound, maxBound2, maxBound3, maxBound4, maxBound5};