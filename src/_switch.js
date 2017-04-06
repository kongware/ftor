"use strict";


// dependencies


const {A, A2, A3} = require("./A");


/**
 * @name lazy, composable switch condition
 * @type alias of A
 * @example
 *

   _switch(({length: len}) => {
     switch (len) {
       case 0: return "unit";
       case 1: return "single";
       case 2: return "pair";
       default: return "n-tuple";
     }
   }) ([1, 2]); // pair

 */


// (a -> b) -> a -> b
const _switch = A;


// (a -> b -> c) -> a -> b -> c
const _switch2 = A2;


// (a -> b -> c -> d) -> a -> b -> c -> d
const _switch3 = A3;


// API


module.exports = {_switch, _switch2, _switch3};