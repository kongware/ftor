"use strict";


// dependencies


const {LT, EQ, GT} = require("./sum/Ordering");


/**
 * @name compare
 * @type first order function
 * @status stable
 * @example

   const $tag = Symbol.for("ftor/tag");

   const LT = ({[$tag]: "LT"});
   const EQ = ({[$tag]: "EQ"});
   const GT = ({[$tag]: "GT"});

   const compare = x => y => x < y ? LT : y < x ? GT : EQ;
   compare("foo") ("bar"); // GT

 */


// Ord a => a -> a -> Ordering
const compare = x => y => x < y ? LT : y < x ? GT : EQ;


// Ord a => a -> a -> Ordering
const compare_ = y => x => x < y ? LT : y < x ? GT : EQ;


// API


module.exports = {compare, compare_};