"use strict";


// dependencies


const {A} = require("./A");


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


// ((a -> b -> c), a) -> b -> c
const _switch2_ = A2_;


// (((a, b) -> c), a) -> b -> c
const _switch2__ = A2__;


// (a -> b -> c -> d) -> a -> b -> c -> d
const _switch3 = A3;


// ((a -> b -> c -> d), a, b) -> c -> d
const _switch3_ = A3_;


// (((a, b, c) -> d), a, b) -> c -> d
const _switch3__ = A3__;


// API


module.exports = {_switch, _switch2, _switch2_, _switch2__, _switch3, _switch3_, _switch3__};