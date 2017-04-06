"use strict";


// dependencies


const len = require("./len");


/**
 * @name equal
 * @type operator function
 * @example
 *

   const x = Triple(1, "a", true);
   const y = Triple(1, "a", true);
   const z = Triple(1, "b", true);
   
   const Num = {eq: (x, y) => x === y};
   const Str = {eq: (x, y) => x === y};
   const Boo = {eq: (x, y) => x === y};

   eq3(Num, Str, Boo) (x) (y); // true
   eq3(Num, Str, Boo) (x) (z); // false

 */


// Eq a => Object -> (a -> b) -> (a -> b) -> Boolean
const eq = Rep => t2 => t1 => t1(len) === t2(len)
 && t1(x => t2(y => Rep.eq(x, y)));


// (Eq a, Eq b) => (Object, Object) -> ((a, b) -> c) -> ((a, b) -> c) -> Boolean
const eq2 = (Rep1, Rep2) => t2 => t1 => t1(len) === t2(len)
 && t1((w, x) => t2((y, z) => Rep1.eq(w, y) && Rep2.eq(x, z)));


// (Eq a, Eq b, Eq c) => (Object, Object, Object) -> ((a, b, c) -> d) -> ((a, b, c) -> d) -> Boolean
const eq3 = (Rep1, Rep2, Rep3) => t2 => t1 => t1(len) === t2(len)
 && t1((u, v, w) => t2((x, y, z) => Rep1.eq(u, x) && Rep2.eq(v, y) && Rep3.eq(w, z)));


// (Eq a, Eq b, Eq c, Eq d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e) -> Boolean
const eq4 = (Rep1, Rep2, Rep3, Rep4) => t2 => t1 => t1(len) === t2(len)
 && t1((s, t, u, v) => t2((w, x, y, z) => Rep1.eq(s, w) && Rep2.eq(t, x) && Rep3.eq(u, y) && Rep4.eq(v, z)));


// (Eq a, Eq b, Eq c, Eq d, Eq e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f) -> Boolean
const eq5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => t2 => t1 => t1(len) === t2(len)
 && t1((q, r, s, t, u) => t2((v, w, x, y, z) => Rep1.eq(q, v) && Rep2.eq(r, w) && Rep3.eq(s, x) && Rep4.eq(t, y) && Rep5.eq(u, z)));


// API


module.exports = {eq, eq2, eq3, eq4, eq5};