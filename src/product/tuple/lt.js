"use strict";


// dependencies


const {compare2, compare3, compare4, compare5} = require("./compare");


/**
 * @name lower than
 * @type higher order function
 * @class Ord
 * @example

   const Ordering = {};
   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   const compare2 = (Rep1, Rep2) => t2 => t1 => t1((w, x) => t2((y, z) => {
     switch (Rep1.compare(y) (w).tag) {
       case "LT": return LT;
       case "GT": return GT;
       case "EQ": {
         switch (Rep2.compare(z) (x).tag) {
           case "LT": return LT;
           case "GT": return GT;
           case "EQ": return EQ;
         }
       }
     }
   }));

   const Pair = (x, y) => f => f(x, y);

   const lt2 = (Rep1, Rep2) => t2 => t1 => compare2(Rep1, Rep2) (t2) (t1).tag === "LT";

   const Num = {compare: y => x => x < y ? LT : y < x ? GT : EQ}
   const Str = {compare: y => x => x < y ? LT : y < x ? GT : EQ}

   const pair1 = Pair(2, "a");
   const pair2 = Pair(2, "b");
   const pair3 = Pair(1, "b");

   lt2(Num, Str) (pair2) (pair1); // true
   lt2(Num, Str) (pair3) (pair1); // false

 */


// Ord a => Object -> (a -> b) -> (a -> b) -> Boolean
const lt = Rep => t2 => t1 => t1(x => t2(y => Rep.lt(y) (x)));


// (Ord a, Ord b) => (Object, Object) -> ((a, b) -> c) -> ((a, b) -> c) -> Boolean
const lt2 = (Rep1, Rep2) => t2 => t1 => compare2(Rep1, Rep2) (t2) (t1).tag === "LT";


// (Ord a, Ord b, Ord c) => (Object, Object, Object) -> ((a, b, c) -> d) -> ((a, b, c) -> d) -> Boolean
const lt3 = (Rep1, Rep2, Rep3) => t2 => t1 => compare3(Rep1, Rep2, Rep3) (t2) (t1).tag === "LT";


// (Ord a, Ord b, Ord c, Ord d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e) -> Boolean
const lt4 = (Rep1, Rep2, Rep3, Rep4) => t2 => t1 => compare4(Rep1, Rep2, Rep3, Rep4) (t2) (t1).tag === "LT";


// (Ord a, Ord b, Ord c, Ord d, Ord e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f) -> Boolean
const lt5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => t2 => t1 => compare5(Rep1, Rep2, Rep3, Rep4, Rep5) (t2) (t1).tag === "LT";


// API


module.exports = {lt, lt2, lt3, lt4, lt5};