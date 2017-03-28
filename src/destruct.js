"use strict";


/**
 * @name destruct
 * @type higher order function
 * @example
 *

   const o = {a: 2, b: 3};
   destruct2(y => x => x + y) ("a", "b") (o); // 5

 */


// (a -> b) -> String -> Object -> b
const destruct = f => x => ({[x]:a}) => f(a);


// ((a -> b), String) -> Object -> b
const destruct_ = (f, x) => ({[x]:a}) => f(a);


// (a -> b -> c) -> (String, String) -> Object -> c
const destruct2 = f => (x, y) => (({[x]:a}), ({[y]:b})) => f(a) (b);


// ((a -> b -> c), String, String) -> Object -> c
const destruct2_ = (f, x, y) => (({[x]:a}), ({[y]:b})) => f(a) (b);


// (((a, b) -> c), String, String) -> Object -> c
const destruct2__ = (f, x, y) => (({[x]:a}), ({[y]:b})) => f(a, b);


// (a -> b -> c -> d) -> (String, String, String) -> Object -> d
const destruct3 = f => (x, y, z) => (({[x]:a}), ({[y]:b}), ({[z]:c})) => f(a) (b) (c);


// ((a -> b -> c -> d), String, String, String) -> Object -> d
const destruct3_ = (f, x, y, z) => (({[x]:a}), ({[y]:b}), ({[z]:c})) => f(a) (b) (c);


// (((a, b, c) -> d), a, b, c, Object, Object) -> Object -> d
const destruct3__ = (f, x, y, z) => (({[x]:a}), ({[y]:b}), ({[z]:c})) => f(a, b, c);


// API


module.exports = {destruct, destruct_, destruct2, destruct2_, destruct2__, destruct3, destruct3_, destruct3__};