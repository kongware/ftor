"use strict";


// dependencies


const {$Tuple} = require("../interop");
const {compare} = require("../primitive/compare");
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


// Setoid a => (a) -> (a) -> Boolean
Tuple.eq = t => u => t[$Tuple] && u[$Tuple] && t[0] === u[0];


// (Setoid a, Setoid b) => (a, b) -> (a, b) -> Boolean
Tuple.eq2 = t => u => t[$Tuple] && u[$Tuple] && t[0] === u[0] && t[1] === u[1];


// (Setoid a, Setoid b, Setoid c) => (a, b, c) -> (a, b, c) -> Boolean
Tuple.eq3 = t => u => t[$Tuple] && u[$Tuple] && t[0] === u[0] && t[1] === u[1] && t[2] === u[2];


// (a -> a -> Boolean) -> (a) -> (a) -> Boolean
Tuple.eqBy = eq => t => u => t[$Tuple] && u[$Tuple] && eq(t[0]) (u[0]);


// (a -> a -> Boolean) -> (b -> b -> Boolean) -> (a, b) -> (a, b) -> Boolean
Tuple.eqBy2 = (eq1, eq2) => t => u => t[$Tuple] && u[$Tuple] && eq(t[0]) (u[0]) && eq(t[1]) (u[1]);


// (a -> a -> Boolean) -> (b -> b -> Boolean) -> (c -> c -> Boolean) -> (a, b) -> (a, b) -> Boolean
Tuple.eqBy3 = (eq1, eq2, eq3) => t => u => t[$Tuple] && u[$Tuple] && eq(t[0]) (u[0]) && eq(t[1]) (u[1]) && eq(t[2]) (u[2]);


// ORD


// Ord a => (a) -> (a) -> Number ordering
Tuple.compare = t => u => t[$Tuple] && u[$Tuple] && compare(t[0]) (u[0]);


// Ord a => (a) -> (a) -> Number ordering
Tuple.compare_ = u => t => t[$Tuple] && u[$Tuple] && compare(t[0]) (u[0]);


// (Ord a, Ord b) => (a, b) -> (a, b) -> Number ordering
Tuple.compare2 = t => u => t[$Tuple] && u[$Tuple] && compare(t[0]) (u[0]) && compare(t[1]) (u[1]);


// (Ord a, Ord b) => (a, b) -> (a, b) -> Number ordering
Tuple.compare2_ = u => t => t[$Tuple] && u[$Tuple] && compare(t[0]) (u[0]) && compare(t[1]) (u[1]);


// (Ord a, Ord b, Ord c) => (a, b, c) -> (a, b, c) -> Number ordering
Tuple.compare3 = t => u =>
 t[$Tuple] && u[$Tuple] && compare(t[0]) (u[0]) && compare(t[1]) (u[1]) && compare(t[2]) (u[2]);


// (Ord a, Ord b, Ord c) => (a, b, c) -> (a, b, c) -> Number ordering
Tuple.compare3_ = u => t =>
 t[$Tuple] && u[$Tuple] && compare(t[0]) (u[0]) && compare(t[1]) (u[1]) && compare(t[2]) (u[2]);


// Number ordering => (a -> a -> ordering) -> (a) -> (a) -> ordering
Tuple.compareBy = compare => t => u => t[$Tuple] && u[$Tuple] && compare(t[0]) (u[0]);


// Number ordering => (a -> a -> ordering, b -> b -> ordering) -> (a, b) -> (a, b) -> ordering
Tuple.compareBy2 = (compare1, compare2) => t => u =>
 t[$Tuple] && u[$Tuple] && compare1(t[0]) (u[0]) && compare2(t[1]) (u[1]);


// Number ordering => (a -> a -> ordering, b -> b -> ordering, c -> c -> ordering) -> (a, b, c) -> (a, b, c) -> ordering
Tuple.compareBy3 = (compare1, compare2, compare3) => t => u =>
 t[$Tuple] && u[$Tuple] && compare1(t[0]) (u[0]) && compare2(t[1]) (u[1]) && compare3(t[2]) (u[2]);


// SEMIGROUP


// (Semigroup a) => (a) -> (a) -> (a)
Tuple.append = t => u => t[$Tuple] && u[$Tuple] && Tuple(t[0] + u[0]);


// (Semigroup a, Semigroup b) => (a, b) -> (a, b) -> (a, b)
Tuple.append2 = t => u => t[$Tuple] && u[$Tuple] && Tuple(t[0] + u[0], t[1] + u[1]);


// (Semigroup a, Semigroup b, Semigroup c) => (a, b, c) -> (a, b, c) -> (a, b, c)
Tuple.append3 = t => u => t[$Tuple] && u[$Tuple] && Tuple(t[0] + u[0], t[1] + u[1], t[2] + u[2]);


// (a -> a -> a) -> (a) -> (a) -> (a)
Tuple.appendBy = append => t => u =>
 t[$Tuple] && u[$Tuple] && Tuple(append(t[0]) (u[0]));


// (a -> a -> a, b -> b -> b) -> (a, b) -> (a, b) -> (a, b)
Tuple.appendBy2 = (append1, append2) => t => u =>
 t[$Tuple] && u[$Tuple] && Tuple(append1(t[0]) (u[0]), append2(t[1]) (u[1]));


// (a -> a -> a, b -> b -> b, c -> c -> c) -> (a, b, c) -> (a, b, c) -> (a, b, c)
Tuple.appendBy3 = (append1, append2, append3) => t => u =>
 t[$Tuple] && u[$Tuple] && Tuple(append1(t[0]) (u[0]), append2(t[1]) (u[1]), append3(t[2]) (u[2]));


// (Semigroup a) => (a) -> (a) -> (a)
Tuple.prepend = u => t => t[$Tuple] && u[$Tuple] && Tuple(t[0] + u[0]);


// (Semigroup a, Semigroup b) => (a, b) -> (a, b) -> (a, b)
Tuple.prepend2 = u => t => t[$Tuple] && u[$Tuple] && Tuple(t[0] + u[0], t[1] + u[1]);


// (Semigroup a, Semigroup b, Semigroup c) => (a, b, c) -> (a, b, c) -> (a, b, c)
Tuple.prepend3 = u => t => t[$Tuple] && u[$Tuple] && Tuple(t[0] + u[0], t[1] + u[1], t[2] + u[2]);


// MONOID


// ()
Tuple.empty = Tuple();


// (a -> a -> a, a) -> [(a)] -> (a)
Tuple.concat = (append, empty) => xs => Tuple(xs.reduce((acc, t) => t[$Tuple] && append(acc) (t[0]), empty));


// (a -> a -> a, a, b -> b -> b, b) -> [(a, b)] -> (a, b)
Tuple.concat2 = (append1, empty1, append2, empty2) => xs =>
 Tuple(
   xs.reduce((acc, t) => t[$Tuple] && append1(acc) (t[0]), empty1),
   xs.reduce((acc, t) => append2(acc) (t[1]), empty2)
 );


// (a -> a -> a, a, b -> b -> b, b, c -> c -> c) -> [(a, b, c)] -> (a, b, c)
Tuple.concat3 = (append1, empty1, append2, empty2, append3, empty3) => xs =>
 Tuple(
   xs.reduce((acc, t) => t[$Tuple] && append1(acc) (t[0]), empty1),
   xs.reduce((acc, t) => append2(acc) (t[1]), empty2),
   xs.reduce((acc, t) => append3(acc) (t[2]), empty3)
 );


// FOLDABLE


// BIFOLDABLE


// TRIFOLDABLE


// TRAVERSABLE


// BITRAVERSABLE


// FUNCTOR


// BIFUNCTOR


// TRIFUNCTOR


// PROFUNCTOR


// ALT


// PLUS


// SPECIFIC


// API


module.exports = Tuple;