"use strict";


// dependencies


const LT = require("../../sum/ordering/LT");
const EQ = require("../../sum/ordering/EQ");
const GT = require("../../sum/ordering/GT");


/**
 * @name compare
 * @type operator function
 * @example

   const pair1 = Pair(2, "a");
   const pair2 = Pair(2, "b");
   const pair3 = Pair(1, "b");

   const Num = { compare: y => x => x < y ? LT : y < x ? GT : EQ }
   const Str = { compare: y => x => x < y ? LT : y < x ? GT : EQ }

   compare2(Num, Str) (pair2) (pair1); // LT
   compare2(Num, Str) (pair3) (pair1); // GT

 */


// Ord a => Object -> (a -> b) -> (a -> b) -> Ordering
const compare = Rep => t2 => t1 => t1(x => t2(y => Rep.compare(y) (x)));


// (Ord a, Ord b) => (Object, Object) -> ((a, b) -> c) -> ((a, b) -> c) -> Ordering
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


// (Ord a, Ord b, Ord c) => (Object, Object, Object) -> ((a, b, c) -> d) -> ((a, b, c) -> d) -> Ordering
const compare3 = (Rep1, Rep2, Rep3) => t2 => t1 => t1((u, v, w) => t2((x, y, z) => {
  switch (Rep1.compare(x) (u).tag) {
    case "LT": return LT;
    case "GT": return GT;
    case "EQ": {
      switch (Rep2.compare(y) (v).tag) {
        case "LT": return LT;
        case "GT": return GT;
        case "EQ": {
          switch (Rep3.compare(z) (w).tag) {
            case "LT": return LT;
            case "GT": return GT;
            case "EQ": return EQ;
          }
        }
      }
    }
  }
}));


// (Ord a, Ord b, Ord c, Ord d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e) -> Ordering
const compare4 = (Rep1, Rep2, Rep3, Rep4) => t2 => t1 => t1((s, t, u, v) => t2((w, x, y, z) => {
  switch (Rep1.compare(w) (s).tag) {
    case "LT": return LT;
    case "GT": return GT;
    case "EQ": {
      switch (Rep2.compare(x) (t).tag) {
        case "LT": return LT;
        case "GT": return GT;
        case "EQ": {
          switch (Rep3.compare(y) (u).tag) {
            case "LT": return LT;
            case "GT": return GT;
            case "EQ": {
              switch (Rep4.compare(z) (v).tag) {
                case "LT": return LT;
                case "GT": return GT;
                case "EQ": return EQ;
              }
            }
          }
        }
      }
    }
  }
}));


// (Ord a, Ord b, Ord c, Ord d, Ord e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f) -> Ordering
const compare5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => t2 => t1 => t1((q, r, s, t, u) => t2((v, w, x, y, z) => {
  switch (Rep1.compare(v) (q).tag) {
    case "LT": return LT;
    case "GT": return GT;
    case "EQ": {
      switch (Rep2.compare(w) (r).tag) {
        case "LT": return LT;
        case "GT": return GT;
        case "EQ": {
          switch (Rep3.compare(x) (s).tag) {
            case "LT": return LT;
            case "GT": return GT;
            case "EQ": {
              switch (Rep4.compare(y) (t).tag) {
                case "LT": return LT;
                case "GT": return GT;
                case "EQ": {
                  switch (Rep5.compare(z) (u).tag) {
                    case "LT": return LT;
                    case "GT": return GT;
                    case "EQ": return EQ;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}));


// API


module.exports = {compare, compare2, compare3, compare4, compare5};