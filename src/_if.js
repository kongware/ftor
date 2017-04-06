"use strict";


// dependencies


const {A, A2, A3} = require("./A");


/**
 * @name lazy, composable if condition
 * @type alias of A
 * @example
 *

   _if(({length: len}) => len = 0 ? "unit"
     : len = 1 ? "single"
     : len = 2 ? "pair"
     : "n-tuple";
   ) ([1, 2]); // pair

   _if(({length: len}) => {
     if (len === 0) return "unit";
     if (len === 1) return "single";
     if (len === 2) return "pair";
     return "n-tuple";
   }) ([1, 2]); // pair

 */


// (a -> b) -> a -> b
const _if = A;


// (a -> b -> c) -> a -> b -> c
const _if2 = A2;


// (a -> b -> c -> d) -> a -> b -> c -> d
const _if3 = A3;


// API


module.exports = {_if, _if2, _if3};