"use strict";


// dependencies


const Tuple4 = require("./Tuple4");


/**
 * @name mininmal bounded 4-Tuple
 * @type operator function
 * @example
 *

   @see minBound3

 */


// Bounded a, Bounded b, Bounded c, Bounded d => Object -> Object -> Object -> Object -> ((a, b, c, d) -> e)
const minBound4 = Rep1 => Rep2 => Rep3 => Rep4 => Pair(Rep1.minBound, Rep2.minBound, Rep3.minBound, Rep4.minBound);


// Bounded a, Bounded b, Bounded c, Bounded d => (Object, Object, Object, Object) -> ((a, b, c, d) -> e)
const minBound4_ = (Rep1, Rep2, Rep3, Rep4) => Pair(Rep1.minBound, Rep2.minBound, Rep3.minBound, Rep4.minBound);


// API


module.exports = {minBound4, minBound4_};