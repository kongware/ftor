"use strict";


// dependencies


const Single = require("./Single");
const Pair = require("./Pair");
const Triplet = require("./Triplet");
const Tuple4 = require("./Tuple4");
const Tuple5 = require("./Tuple5");


/**
 * @name mininmal bounded Single
 * @type operator function
 * @example
 *

   const Num = {minBound: -Infinity};
   const Boo = {minBound: false};
   const Chr = {minBound: "\u{0}"}
   minBound3(Num) (Boo) (Chr) (x => _ => _ => x); // -Infinity
   minBound3(Num) (Boo) (Chr) (_ => y => _ => y); // false
   minBound3(Num) (Boo) (Chr) (_ => _ => z => z); // "\u{0}"

 */


// Bounded a => Object -> (a -> b)
const minBound = Rep => Single(Rep.minBound);


// Bounded a, Bounded b => Object -> Object -> ((a, b) -> c)
const minBound2 = Rep1 => Rep2 => Pair(Rep1.minBound, Rep2.minBound);


// Bounded a, Bounded b, Bounded c => Object -> Object -> Object -> ((a, b, c) -> d)
const minBound3 = Rep1 => Rep2 => Rep3 => Pair(Rep1.minBound, Rep2.minBound, Rep3.minBound);


// Bounded a, Bounded b, Bounded c, Bounded d => Object -> Object -> Object -> Object -> ((a, b, c, d) -> e)
const minBound4 = Rep1 => Rep2 => Rep3 => Rep4 => Pair(Rep1.minBound, Rep2.minBound, Rep3.minBound, Rep4.minBound);


// Bounded a, Bounded b, Bounded c, Bounded d, Bounded e => Object -> Object -> Object -> Object -> Object -> ((a, b, c, d, e) -> f)
const minBound5 = Rep1 => Rep2 => Rep3 => Rep4 => Rep5 => Pair(Rep1.minBound, Rep2.minBound, Rep3.minBound, Rep4.minBound, Rep5.minBound);


// API


module.exports = {minBound, minBound2, minBound3, minBound4, minBound5};