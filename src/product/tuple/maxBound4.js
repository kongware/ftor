"use strict";


// dependencies


const Tuple4 = require("./Tuple4");


/**
 * @name maxinmal bounded 4-Tuple
 * @type operator function
 * @example
 *

   @see maxBound3

 */


// Bounded a, Bounded b, Bounded c, Bounded d => Object -> Object -> Object -> Object -> (a -> b -> c -> d -> e)
const maxBound4 = Rep1 => Rep2 => Rep3 => Rep4 => Pair(Rep1.maxBound, Rep2.maxBound, Rep3.maxBound, Rep4.maxBound);


// Bounded a, Bounded b, Bounded c, Bounded d => (Object, Object, Object, Object) -> (a -> b -> c -> d -> e)
const maxBound4_ = (Rep1, Rep2, Rep3, Rep4) => Pair(Rep1.maxBound, Rep2.maxBound, Rep3.maxBound, Rep4.maxBound);


// API


module.exports = {maxBound4, maxBound4_};