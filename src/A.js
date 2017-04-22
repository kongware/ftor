"use strict";


/**
 * @name (reverse) application
 * @type higher order function
 * @example

   const A = f => x => f(x);
   const sqr = x => x * x;
   const add = x => y => x + y;

   // immediately invoke a lambda (semantic sugar):
   A(x => x * x) (5); // 25

   // or destructure some input:
   A(({x, y}) => add(x) (y)) ({x: 2, y: 3}); // 5

   // or transform a statement into an expression:
   A(n => {
     switch (n) {
       case 1: return "one";
       case 2: return "two";
       case 3: return "three";
       default: return "out of range";
     }
   }) (2); // "two"

   // or transform an eager expression into a lazy one:
   const superstition = A(n => n === 7 ? "Lucky number seven!" : "You're out of luck, pal!");

   superstition(7); // "Lucky number seven!"
   superstition(1); // "You're out of luck, pal!"
   
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