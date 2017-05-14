"use strict";


/**
 * @name applicator
 * @type higher order function
 * @status stable
 * @example

   const A = f => x => f(x);

   const writeOut = A(({foo}) => {
     switch (foo) {
       case 1: return "one";
       case 2: return "two";
       case 3: return "three";
       default: return "out of range";
     }
   });

   const o = {foo: 2}, p = {foo: 5};

   writeOut(o); // "two"
   writeOut(p); // "out of range"

 */


// (a -> b) -> a -> b
const A = f => x => f(x);


// (a -> b) -> b
const A0 = f => f();


// (a -> b -> c) -> a -> b -> c
const A2 = f => x => y => f(x) (y);


// (a -> b -> c -> d) -> a -> b -> c -> d
const A3 = f => x => y => z => f(x) (y) (z);


// API


module.exports = {A, A0, A2, A3};