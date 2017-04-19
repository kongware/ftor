"use strict";


// dependencies


const {A, A2, A3} = require("./A");


/**
 * @name otherwise
 * @type alias of A
 * @example

   @see match

 */


// (a -> b) -> a -> b
const otherwise = A;


// (a -> b -> c) -> a -> b -> c
const otherwise2 = A2;


// (a -> b -> c -> d) -> a -> b -> c -> d
const otherwise3 = A3;


// API


module.exports = {otherwise, otherwise2, otherwise3};