"use strict";


// dependencies


const Tuple = require("./Tuple");


/**
 * @name Bounded type class
 * @type type representative
 * @kind * -> * 
 */


const Bounded = {};


/**
 * @name mininmal bounded
 * @type higher order function
 * @example

   const Ordering = {};
   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   const Tuple = (...args) => f => f(...args);
   const Pair = (x, y) => f => f(x, y);
   const toArray = (...args) => args;

   const Ord = {};

   Ord.compare2 = (Rep1, Rep2) => t2 => t1 => t1((w, x) => t2((y, z) => {
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

   Ord.lt2 = (Rep1, Rep2) => t2 => t1 => Ord.compare2(Rep1, Rep2) (t2) (t1).tag === "LT";

   const Bounded = {};
   Bounded.minBound2 = (Rep1, Rep2) => Tuple(Rep1.minBound, Rep2.minBound);

   const Num = {minBound: -Infinity, compare: y => x => x < y ? LT : y < x ? GT : EQ}
   const Chr = {minBound: "\u{0}", compare: y => x => x < y ? LT : y < x ? GT : EQ}

   const minPair = Bounded.minBound2(Num, Chr);
   const pair = Pair(0, "a");

   Ord.lt2(Num, Chr) (pair) (minPair); // true

 */


// Bounded a => Object -> (a -> b)
Bounded.minBound = Rep => Tuple(Rep.minBound);


// Bounded a, Bounded b => (Object, Object) -> ((a, b) -> c)
Bounded.minBound2 = (Rep1, Rep2) => Tuple(Rep1.minBound, Rep2.minBound);


// Bounded a, Bounded b, Bounded c => (Object, Object, Object) -> ((a, b, c) -> d)
Bounded.minBound3 = (Rep1, Rep2, Rep3) => Tuple(Rep1.minBound, Rep2.minBound, Rep3.minBound);


// Bounded a, Bounded b, Bounded c, Bounded d => (Object, Object, Object, Object) -> ((a, b, c, d) -> e)
Bounded.minBound4 = (Rep1, Rep2, Rep3, Rep4) => Tuple(Rep1.minBound, Rep2.minBound, Rep3.minBound, Rep4.minBound);


// Bounded a, Bounded b, Bounded c, Bounded d, Bounded e => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f)
Bounded.minBound5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => Tuple(Rep1.minBound, Rep2.minBound, Rep3.minBound, Rep4.minBound, Rep5.minBound);


/**
 * @name maximal bounded
 * @type higher order function
 * @example

   @see minBound

 */


// Bounded a => Object -> (a -> b)
Bounded.maxBound = Rep => Tuple(Rep.maxBound);


// (Bounded a, Bounded b) => (Object, Object) -> ((a, b) -> c)
Bounded.maxBound2 = (Rep1, Rep2) => Tuple(Rep1.maxBound, Rep2.maxBound);


// (Bounded a, Bounded b, Bounded c) => (Object, Object, Object) -> ((a, b, c) -> d)
Bounded.maxBound3 = (Rep1, Rep2, Rep3) => Tuple(Rep1.maxBound, Rep2.maxBound, Rep3.maxBound);


// (Bounded a, Bounded b, Bounded c, Bounded d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e)
Bounded.maxBound4 = (Rep1, Rep2, Rep3, Rep4) => Tuple(Rep1.maxBound, Rep2.maxBound, Rep3.maxBound, Rep4.maxBound);


// (Bounded a, Bounded b, Bounded c, Bounded d, Bounded e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f)
Bounded.maxBound5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => Tuple(Rep1.maxBound, Rep2.maxBound, Rep3.maxBound, Rep4.maxBound, Rep5.maxBound);


// API


module.exports = Bounded;