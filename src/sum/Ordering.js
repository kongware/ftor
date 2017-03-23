"use strict";


// dependencies


const {K, raise_, True, False} = require("../generic");


// private


const ternarySum = (f, g, h) => fy => fx => {
  const x = Ordering.fromEnum(fx),
   y  = Ordering.fromEnum(fy);

  return x < y
   ? f()
   : x > y
    ? g()
    : h();
};


const ternarySum_ = (f, g, h) => (fx, fy) => {
  const x = Ordering.fromEnum(fx),
   y  = Ordering.fromEnum(fy);

  return x < y
   ? f()
   : x > y
    ? g()
    : h();
};


// type representative


const Ordering = {}; // kind *


// constructors (nullary)


const LT = ({type: Ordering, tag: "LT"})


const EQ = ({type: Ordering, tag: "EQ"})


const GT = ({type: Ordering, tag: "GT"})


// Bounded


Ordering.minBound = Ordering.LT;


Ordering.maxBound = Ordering.GT;


// Setoid


Ordering.eq = ternarySum(False, False, True);


Ordering.eq_ = ternarySum_(False, False, True);


Ordering.neq = ternarySum(True, True, False);


Ordering.neq_ = ternarySum_(True, True, False);


// Ord


Ordering.compare = ternarySum(K(LT), K(GT), K(EQ));


Ordering.compare_ = ternarySum_(K(LT), K(GT), K(EQ));


Ordering.lt = ternarySum(True, False, False);


Ordering.lt_ = ternarySum_(True, False, False);


Ordering.lte = ternarySum(True, False, True);


Ordering.lte_ = ternarySum_(True, False, True);


Ordering.gt = ternarySum(False, True, False);


Ordering.gt_ = ternarySum_(False, True, False);


Ordering.gte = ternarySum(False, True, True);


Ordering.gte_ = ternarySum_(False, True, True);


Ordering.min = fy => fx => {
  const x = Ordering.fromEnum(fx),
   y  = Ordering.fromEnum(fy);

  return x < y
   ? fx
   : x > y
    ? fy
    : fx;
}


Ordering.max = fy => fx => {
  const x = Ordering.fromEnum(fx),
   y  = Ordering.fromEnum(fy);

  return x < y
   ? fy
   : x > y
    ? fx
    : fx;
}


// Enum

Ordering.pred = ({tag}) => ({
  LT: raise_(TypeError, "invalid pred invocation with LT"),
  EQ: LT,
  GT: EQ
})[tag];


Ordering.succ = ({tag}) => ({
  LT: EQ,
  EQ: GT,
  GT: raise_(TypeError, "invalid succ invocation with GT")
})[tag];


Ordering.fromEnum = ({tag}) => ({LT: 0, EQ: 1, GT: 2})[tag];


Ordering.toEnum = n => [LT, EQ, GT][n];


// Semigroup


Ordering.concat = sy => ({tag}) => ({LT, EQ: sy, GT})[tag];


Ordering.concat_ = ({tag}, sy) => ({LT, EQ: sy, GT})[tag];


// Monoid


Ordering.append = Ordering.concat;


Ordering.append_ = Ordering.concat_;


Ordering.empty = () => EQ;


// API


module.exports = {Ordering, LT, EQ, GT};