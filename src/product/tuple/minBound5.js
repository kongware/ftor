"use strict";


// dependencies


const Tuple5 = require("./Tuple5");


/**
 * @name mininmal bounded 5-Tuple
 * @type operator function
 * @example
 *

   @see minBound3

 */


// Bounded a, Bounded b, Bounded c, Bounded d, Bounded e => Object -> Object -> Object -> Object -> Object -> ((a, b, c, d, e) -> f)
const minBound5 = Rep1 => Rep2 => Rep3 => Rep4 => Rep5 => Pair(Rep1.minBound, Rep2.minBound, Rep3.minBound, Rep4.minBound, Rep5.minBound);


// Bounded a, Bounded b, Bounded c, Bounded d, Bounded e => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f)
const minBound5_ = (Rep1, Rep2, Rep3, Rep4, Rep5) => Pair(Rep1.minBound, Rep2.minBound, Rep3.minBound, Rep4.minBound, Rep5.minBound);


// API


module.exports = {minBound5, minBound5_};