"use strict";


// dependencies


const {$Tuple} = require("../interop");
const EQ = require("../primitive/EQ");
const LT = require("../primitive/LT");
const GT = require("../primitive/GT");


// CONSTRUCTOR


/**
 * @name Tuple
 * @note combined constructor/namespace
 * @type product type
 * @status stable
 */


// (*) -> [*]
const Tuple = (...args) => args[$Tuple] = true, Object.seal(args), args;


// SETOID


// Setoid a => [a] -> [a] -> Boolean
Tuple.eq = t => u => t[$Tuple] && u[$Tuple] && t[0] === u[0];


// (Setoid a, Setoid b) => [a, b] -> [a, b] -> Boolean
Tuple.eq2 = t => u => t[$Tuple] && u[$Tuple] && t[0] === u[0] && t[1] === u[1];


// (Setoid a, Setoid b, Setoid c) => [a, b, c] -> [a, b, c] -> Boolean
Tuple.eq3 = t => u => t[$Tuple] && u[$Tuple] && t[0] === u[0] && t[1] === u[1] && t[2] === u[2];


// (a -> a -> Boolean) -> [a] -> [a] -> Boolean
Tuple.eqBy = eq => t => u => t[$Tuple] && u[$Tuple] && eq(t[0]) (u[0]);


// (a -> a -> Boolean) -> (b -> b -> Boolean) -> [a, b] -> [a, b] -> Boolean
Tuple.eqBy2 = (eq1, eq2) => t => u => t[$Tuple] && u[$Tuple] && eq(t[0]) (u[0]) && eq(t[1]) (u[1]);


// (a -> a -> Boolean) -> (b -> b -> Boolean) -> (c -> c -> Boolean) -> [a, b] -> [a, b] -> Boolean
Tuple.eqBy3 = (eq1, eq2, eq3) => t => u => t[$Tuple] && u[$Tuple] && eq(t[0]) (u[0]) && eq(t[1]) (u[1]) && eq(t[2]) (u[2]);


// ORD


// SEMIGROUP


// MONOID


// FOLDABLE


// BIFOLDABLE


// TRAVERSABLE


// BITRAVERSABLE


// FUNCTOR


// BIFUNCTOR


// PROFUNCTOR


// ALT


// PLUS


// SPECIFIC


// API


module.exports = Tuple;