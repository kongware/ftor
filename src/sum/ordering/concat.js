"use strict";


// dependencies


const LT = require("./LT");
const GT = require("./GT");


/**
 * @name concatenate
 * @type associative binary operation (semigroup)
 * @status stable
 * @example

   const Ordering = {};
   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   const concat = ({tag: x}) => t => ({LT, EQ: t, GT})[x];

   concat(LT) (LT); // LT
   concat(LT) (EQ); // LT
   concat(GT) (LT); // GT
   concat(EQ) (LT); // LT

 */


// Ordering -> Ordering -> Ordering
const concat = ({tag}) => t => ({LT, EQ: t, GT})[tag];


// Ordering -> Ordering -> Ordering
const concat_ = t => ({tag}) => ({LT, EQ: t, GT})[tag];


// API


module.exports = {concat, concat_};