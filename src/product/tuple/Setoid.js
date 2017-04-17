"use strict";


// dependencies


const len = require("./len");


/**
 * @name Setoid type class
 * @type type representative
 * @kind * -> *
 */


const Setoid = {};


/**
 * @name equal
 * @type higher order function
 * @example

   const Pair = (x, y) => f => f(x, y);
   const len = (...args) => args.length;

   const Setoid = {};

   Setoid.eq2 = (Rep1, Rep2) => t2 => t1 => t1(len) === t2(len)
    && t1((w, x) => t2((y, z) => Rep1.eq(y) (w) && Rep2.eq(z) (x)));

   const Num = {eq: y => x => x === y};
   const Str = {eq: y => x => x === y};

   const x = Pair(1, "a");
   const y = Pair(1, "a");
   const z = Pair(1, "b");
   
   Setoid.eq2(Num, Str) (x) (y); // true
   Setoid.eq2(Num, Str) (x) (z); // false

 */


// Eq a => Object -> (a -> b) -> (a -> b) -> Boolean
Setoid.eq = Rep => t2 => t1 => t1(len) === t2(len)
 && t1(x => t2(y => Rep.eq(y) (x)));


// (Eq a, Eq b) => (Object, Object) -> ((a, b) -> c) -> ((a, b) -> c) -> Boolean
Setoid.eq2 = (Rep1, Rep2) => t2 => t1 => t1(len) === t2(len)
 && t1((w, x) => t2((y, z) => Rep1.eq(y) (w) && Rep2.eq(z) (x)));


// (Eq a, Eq b, Eq c) => (Object, Object, Object) -> ((a, b, c) -> d) -> ((a, b, c) -> d) -> Boolean
Setoid.eq3 = (Rep1, Rep2, Rep3) => t2 => t1 => t1(len) === t2(len)
 && t1((u, v, w) => t2((x, y, z) => Rep1.eq(x) (u) && Rep2.eq(y) (v) && Rep3.eq(z) (w)));


// (Eq a, Eq b, Eq c, Eq d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e) -> Boolean
Setoid.eq4 = (Rep1, Rep2, Rep3, Rep4) => t2 => t1 => t1(len) === t2(len)
 && t1((s, t, u, v) => t2((w, x, y, z) => Rep1.eq(w) (s) && Rep2.eq(x) (t) && Rep3.eq(y) (u) && Rep4.eq(z) (v)));


// (Eq a, Eq b, Eq c, Eq d, Eq e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f) -> Boolean
Setoid.eq5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => t2 => t1 => t1(len) === t2(len)
 && t1((q, r, s, t, u) => t2((v, w, x, y, z) => Rep1.eq(v) (q) && Rep2.eq(w) (r) && Rep3.eq(x) (s) && Rep4.eq(y) (t) && Rep5.eq(z) (u)));


/**
 * @name not equal
 * @type higher order function
 * @example

   @see eq

 */


// Eq a => Object -> (a -> b) -> (a -> b) -> Boolean
Setoid.neq = Rep => t2 => t1 => !Setoid.eq(Rep) (t2) (t1);


// (Eq a, Eq b) => (Object, Object) -> ((a, b) -> c) -> ((a, b) -> c) -> Boolean
Setoid.neq2 = (Rep1, Rep2) => t2 => t1 => !Setoid.eq2(Rep1, Rep2) (t2) (t1);


// (Eq a, Eq b, Eq c) => (Object, Object, Object) -> ((a, b, c) -> d) -> ((a, b, c) -> d) -> Boolean
Setoid.neq3 = (Rep1, Rep2, Rep3) => t2 => t1 => !Setoid.eq3(Rep1, Rep2, Rep3) (t2) (t1);


// (Eq a, Eq b, Eq c, Eq d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e) -> Boolean
Setoid.neq4 = (Rep1, Rep2, Rep3, Rep4) => t2 => t1 => !Setoid.eq4(Rep1, Rep2, Rep3, Rep4) (t2) (t1);


// (Eq a, Eq b, Eq c, Eq d, Eq e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f) -> Boolean
Setoid.neq5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => t2 => t1 => !Setoid.eq5(Rep1, Rep2, Rep3, Rep4, Rep5) (t2) (t1);


// API


module.exports = Setoid;