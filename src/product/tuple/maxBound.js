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

   const _Number = {maxBound: Infinity};
   const _Boolean = {maxBound: true};
   const _Char = {maxBound: "\u{10FFFF}"}
   maxBound3(_Number) (_Boolean) (_Char) (x => _ => _ => x); // Infinity
   maxBound3(_Number) (_Boolean) (_Char) (_ => y => _ => y); // true
   maxBound3(_Number) (_Boolean) (_Char) (_ => _ => z => z); // "\u{10FFFF}"

 */


// Bounded a => Object -> (a -> b)
const maxBound = Rep => Single(Rep.maxBound);


// (Bounded a, Bounded b) => Object -> Object -> ((a, b) -> c)
const maxBound2 = Rep1 => Rep2 => Pair(Rep1.maxBound, Rep2.maxBound);


// (Bounded a, Bounded b) => (Object, Object) -> ((a, b) -> c)
const maxBound2_ = (Rep1, Rep2) => Pair(Rep1.maxBound, Rep2.maxBound);


// (Bounded a, Bounded b, Bounded c) => Object -> Object -> Object -> ((a, b, c) -> d)
const maxBound3 = Rep1 => Rep2 => Rep3 => Pair(Rep1.maxBound, Rep2.maxBound, Rep3.maxBound);


// (Bounded a, Bounded b, Bounded c) => (Object, Object, Object) -> ((a, b, c) -> d)
const maxBound3_ = (Rep1, Rep2, Rep3) => Pair(Rep1.maxBound, Rep2.maxBound, Rep3.maxBound);


// (Bounded a, Bounded b, Bounded c, Bounded d) => Object -> Object -> Object -> Object -> ((a, b, c, d) -> e)
const maxBound4 = Rep1 => Rep2 => Rep3 => Rep4 => Pair(Rep1.maxBound, Rep2.maxBound, Rep3.maxBound, Rep4.maxBound);


// (Bounded a, Bounded b, Bounded c, Bounded d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e)
const maxBound4_ = (Rep1, Rep2, Rep3, Rep4) => Pair(Rep1.maxBound, Rep2.maxBound, Rep3.maxBound, Rep4.maxBound);


// (Bounded a, Bounded b, Bounded c, Bounded d, Bounded e) => Object -> Object -> Object -> Object -> Object -> ((a, b, c, d, e) -> f)
const maxBound5 = Rep1 => Rep2 => Rep3 => Rep4 => Rep5 => Pair(Rep1.maxBound, Rep2.maxBound, Rep3.maxBound, Rep4.maxBound, Rep5.maxBound);


// (Bounded a, Bounded b, Bounded c, Bounded d, Bounded e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f)
const maxBound5_ = (Rep1, Rep2, Rep3, Rep4, Rep5) => Pair(Rep1.maxBound, Rep2.maxBound, Rep3.maxBound, Rep4.maxBound, Rep5.maxBound);


// API


module.exports = {maxBound, maxBound2, maxBound2_, maxBound3, maxBound3_, maxBound4, maxBound4_, maxBound5, maxBound5_};