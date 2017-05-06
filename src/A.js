"use strict";


/**
 * @name (reverse) application
 * @type higher order function
 * @status stable
 * @example

   const A = f => x => f(x);

   A(n => {
     switch (n) {
       case 1: return "one";
       case 2: return "two";
       case 3: return "three";
       default: return "out of range";
     }
   }) (2); // "two"

 */


// (a -> b) -> a -> b
const A = f => x => f(x);


// a -> (a -> b) -> b
const A_ = x => f => f(x);


// (a -> b -> c) -> a -> b -> c
const A2 = f => x => y => f(x) (y);


// a -> b -> (a -> b -> c) -> c
const A2_ = x => y => f => f(x) (y);


// (a -> b -> c -> d) -> a -> b -> c -> d
const A3 = f => x => y => z => f(x) (y) (z);


// a -> b -> c -> (a -> b -> c -> d) -> d
const A3_ = x => y => z => f => f(x) (y) (z);


// API


module.exports = {A, A_, A2, A2_, A3, A3_};