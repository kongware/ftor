"use strict";


// dependencies


const Tuple = require("./Tuple");


/**
 * @name concat
 * @type operator function
 * @example

   const pair1 = Pair(1, "a");
   const pair2 = Pair(2, "b");

   const Num = { concat: y => x => x + y }
   const Str = { concat: y => x => x + y }

   concat2(Num, Str) (pair2) (pair1); // Pair(3, "ab")

 */


// Semigroup a => Object -> (a -> b) -> (a -> b) -> (a -> b)
const concat = Rep => t2 => t1 => t1(x => t2(y => Tuple(Rep.concat(y) (x))));


// (Semigroup a, Semigroup b) => (Object, Object) -> ((a, b) -> c) -> ((a, b) -> c) -> ((a, b) -> c)
const concat2 = (Rep1, Rep2) => t2 => t1 => t1((w, x) => t2((y, z) => Tuple(Rep1.concat(y) (w), Rep2.concat(x) (z))));


// (Semigroup a, Semigroup b, Semigroup c) => (Object, Object, Object) -> ((a, b, c) -> d) -> ((a, b, c) -> d) -> ((a, b, c) -> d)
const concat3 = (Rep1, Rep2, Rep3) => t2 => t1 => t1((u, v, w) => t2((x, y, z) => Tuple(Rep1.concat(x) (u), Rep2.concat(y) (v), Rep3.concat(z) (w))));


// (Semigroup a, Semigroup b, Semigroup c, Semigroup d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e)
const concat4 = (Rep1, Rep2, Rep3, Rep4) => t2 => t1 => t1((s, t, u, v) => t2((w, x, y, z) => Tuple(Rep1.concat(w) (s), Rep2.concat(x) (t), Rep3.concat(y) (u), Rep4.concat(z) (v))));


// (Semigroup a, Semigroup b, Semigroup c, Semigroup d, Semigroup e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f)
const concat5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => t2 => t1 => t1((q, r, s, t, u) => t2((v, w, x, y, z) => Tuple(Rep1.concat(v) (q), Rep2.concat(w) (r), Rep3.concat(x) (s), Rep4.concat(y) (t), Rep5.concat(z) (u))));


// API


module.exports = {concat, concat2, concat3, concat4, concat5};