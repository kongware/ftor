"use strict";


// dependencies


const {A, A2, A3} = require("./A");


/**
 * @name lazy, composable switch expression
 * @type alias of A
 * @example

   const A = f => x => f(x);
   const switch_ = A;

   const writeOut = switch_(n => {
     switch (n) {
       case 0: return "zero";
       case 1: return "one";
       case 2: return "two";
       case 3: return "three";
       default: return new Error(n + " is out of range");
     }
   });

   writeOut(2); // "two"
   writeOut(4); // Error: out of range

 */


// (a -> b) -> a -> b
const switch_ = A;


// (a -> b -> c) -> a -> b -> c
const switch2 = A2;


// (a -> b -> c -> d) -> a -> b -> c -> d
const switch3 = A3;


// API


module.exports = {switch_, switch2, switch3};