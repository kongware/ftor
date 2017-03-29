"use strict";


// dependencies


const Tuple5 = require("./Tuple5");


/**
 * @name maxinmal bounded 5-Tuple
 * @type operator function
 * @example
 *

   @see maxBound3

 */


// Bounded a, Bounded b, Bounded c, Bounded d, Bounded e => Object -> Object -> Object -> Object -> Object -> ((a, b, c, d, e) -> f)
const maxBound5 = Rep1 => Rep2 => Rep3 => Rep4 => Rep5 => Pair(Rep1.maxBound, Rep2.maxBound, Rep3.maxBound, Rep4.maxBound, Rep5.maxBound);


// Bounded a, Bounded b, Bounded c, Bounded d, Bounded e => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f)
const maxBound5_ = (Rep1, Rep2, Rep3, Rep4, Rep5) => Pair(Rep1.maxBound, Rep2.maxBound, Rep3.maxBound, Rep4.maxBound, Rep5.maxBound);


// API


module.exports = {maxBound5, maxBound5_};