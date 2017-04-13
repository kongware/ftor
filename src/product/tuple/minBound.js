"use strict";


// dependencies


const Tuple = require("./Tuple");


/**
 * @name mininmal bounded Single
 * @type operator function
 * @example

   ?

 */


// Bounded a => Object -> (a -> b)
const minBound = Rep => Tuple(Rep.minBound);


// Bounded a, Bounded b => (Object, Object) -> ((a, b) -> c)
const minBound2 = (Rep1, Rep2) => Tuple(Rep1.minBound, Rep2.minBound);


// Bounded a, Bounded b, Bounded c => (Object, Object, Object) -> ((a, b, c) -> d)
const minBound3 = (Rep1, Rep2, Rep3) => Tuple(Rep1.minBound, Rep2.minBound, Rep3.minBound);


// Bounded a, Bounded b, Bounded c, Bounded d => (Object, Object, Object, Object) -> ((a, b, c, d) -> e)
const minBound4 = (Rep1, Rep2, Rep3, Rep4) => Tuple(Rep1.minBound, Rep2.minBound, Rep3.minBound, Rep4.minBound);


// Bounded a, Bounded b, Bounded c, Bounded d, Bounded e => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f)
const minBound5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => Tuple(Rep1.minBound, Rep2.minBound, Rep3.minBound, Rep4.minBound, Rep5.minBound);


// API


module.exports = {minBound, minBound2, minBound3, minBound4, minBound5};