"use strict";


/**
 * @name compare
 * @type operator function
 * @example

   ?

 */


// Ord a => Object -> (a -> b) -> (a -> b) -> Ordering
const compare = Rep => t2 => t1 => t1(x => t2(y => Rep.compare(y) (x)));


// (Ord a, Ord b) => (Object, Object) -> ((a, b) -> c) -> ((a, b) -> c) -> Ordering
const compare2 = (Rep1, Rep2) => t2 => t1 => t1((w, x) => t2((y, z) => Rep1.compare(y) (w) && Rep2.compare(z) (x)));


// (Ord a, Ord b, Ord c) => (Object, Object, Object) -> ((a, b, c) -> d) -> ((a, b, c) -> d) -> Ordering
const compare3 = (Rep1, Rep2, Rep3) => t2 => t1 => t1((u, v, w) => t2((x, y, z) => Rep1.compare(x) (u) && Rep2.compare(y) (v) && Rep3.compare(z) (w)));


// (Ord a, Ord b, Ord c, Ord d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e) -> Ordering
const compare4 = (Rep1, Rep2, Rep3, Rep4) => t2 => t1 => t1((s, t, u, v) => t2((w, x, y, z) => Rep1.compare(w) (s) && Rep2.compare(x) (t) && Rep3.compare(y) (u) && Rep4.compare(z) (v)));


// (Ord a, Ord b, Ord c, Ord d, Ord e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f) -> Ordering
const compare5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => t2 => t1 => t1((q, r, s, t, u) => t2((v, w, x, y, z) => Rep1.compare(v) (q) && Rep2.compare(w) (r) && Rep3.compare(x) (s) && Rep4.compare(y) (t) && Rep5.compare(z) (u)));


// API


module.exports = {compare, compare2, compare3, compare4, compare5};