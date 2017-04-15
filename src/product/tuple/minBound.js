"use strict";


// dependencies


const Tuple = require("./Tuple");


/**
 * @name mininmal bounded
 * @type higher order function
 * @class Bounded
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

   const Tuple = (...args) => f => f(...args);
   const Pair = (x, y) => f => f(x, y);
   const toArray = (...args) => args;
   const minBound2 = (Rep1, Rep2) => Tuple(Rep1.minBound, Rep2.minBound);
   const lt2 = (Rep1, Rep2) => t2 => t1 => compare2(Rep1, Rep2) (t2) (t1).tag === "LT";

   const Num = {minBound: -Infinity, compare: y => x => x < y ? LT : y < x ? GT : EQ}
   const Chr = {minBound: "\u{0}", compare: y => x => x < y ? LT : y < x ? GT : EQ}

   const minPair = minBound2(Num, Chr);
   const pair = Pair(0, "a");

   lt2(Num, Chr) (pair) (minPair); // true

 */


// Bounded a => Object -> (a -> b)
const minBound = Rep => Tuple(Rep.minBound);


// Bounded a, Bounded b => (Object, Object) -> ((a, b) -> c)
const minBound2 = (Rep1, Rep2) => Tuple(Rep1.minBound, Rep2.minBound);


// Bounded a, Bounded b, Bounded c => (Object, Object, Object) -> ((a, b, c) -> d)
const minBound3 = (Rep1, Rep2, Rep3) => Tuple(Rep1.minBound, Rep2.minBound, Rep3.minBound);


// Bounded a, Bounded b, Bounded c, Bounded d => (Object, Object, Object, Object) -> ((a, b, c, d) -> e)
const minBound4 = (Rep1, Rep2, Rep3, Rep4) => Tuple(Rep1.minBound, Rep2.minBound, Rep3.minBound, Rep4.minBound);


// Bounded a, Bounded b, Bounded c, Bounded d, Bounded e => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f)
const minBound5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => Tuple(Rep1.minBound, Rep2.minBound, Rep3.minBound, Rep4.minBound, Rep5.minBound);


// API


module.exports = {minBound, minBound2, minBound3, minBound4, minBound5};