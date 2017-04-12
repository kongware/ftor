"use strict";


// dependencies


const {eq, eq2, eq3, eq4, eq5} = require("./eq");


/**
 * @name equal
 * @type operator function
 * @example

   @see eq

 */


// Eq a => Object -> (a -> b) -> (a -> b) -> Boolean
const neq = Rep => t2 => t1 => !eq(Rep) (t2) (t1);


// (Eq a, Eq b) => (Object, Object) -> ((a, b) -> c) -> ((a, b) -> c) -> Boolean
const neq2 = (Rep1, Rep2) => t2 => t1 => !eq2(Rep1, Rep2) (t2) (t1);


// (Eq a, Eq b, Eq c) => (Object, Object, Object) -> ((a, b, c) -> d) -> ((a, b, c) -> d) -> Boolean
const neq3 = (Rep1, Rep2, Rep3) => t2 => t1 => !eq3(Rep1, Rep2, Rep3) (t2) (t1);


// (Eq a, Eq b, Eq c, Eq d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e) -> Boolean
const neq4 = (Rep1, Rep2, Rep3, Rep4) => t2 => t1 => !eq4(Rep1, Rep2, Rep3, Rep4) (t2) (t1);


// (Eq a, Eq b, Eq c, Eq d, Eq e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f) -> Boolean
const neq5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => t2 => t1 => !eq5(Rep1, Rep2, Rep3, Rep4, Rep5) (t2) (t1);



// API


module.exports = {neq, neq2, neq3, neq4, neq5};