"use strict";


// dependencies


const {A, A2, A3} = require("./A");


/**
 * @name lazy, composable if expression
 * @type alias of A
 * @example

   const A = f => x => f(x);
   const if_ = A;

   const bet = if_(n => n === 7 ? "Lucky number seven!" : "You're out of luck, pal!");

   bet(7); // "Lucky number seven!"
   bet(1); // "You're out of luck, pal!"

 */


// (a -> b) -> a -> b
const if_ = A;


// (a -> b -> c) -> a -> b -> c
const if2 = A2;


// (a -> b -> c -> d) -> a -> b -> c -> d
const if3 = A3;


// API


module.exports = {if_, if2, if3};