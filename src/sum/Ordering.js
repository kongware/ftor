"use strict";


// dependencies


const {A, raise_} = require("../generic");


const {eq, eq_, lt_, lte_, gt_, gte_, neq, neq_} = require("../primitive/generic");


const {destruct2, destruct2_} = require("../product/object");


// private


const xt = f => oy => ox => {
  const x = Ordering.fromEnum(ox),
   y  = Ordering.fromEnum(oy);

  return f(x, y);
};


const xt_ = f => (ox, oy) => {
  const x = Ordering.fromEnum(ox),
   y  = Ordering.fromEnum(oy);

  return f(x, y);
};


// type representative


const Ordering = {};


// constructors


const LT = ({type: Ordering, tag: "LT"})


const EQ = ({type: Ordering, tag: "EQ"})


const GT = ({type: Ordering, tag: "GT"})


// general


Ordering.cata = pattern => ({tag}) => pattern[tag]();


// Bounded


Ordering.minBound = Ordering.LT;


Ordering.maxBound = Ordering.GT;


// Setoid


Ordering.eq = destruct2("tag", "tag") (eq);


Ordering.eq_ = destruct2_("tag", "tag") (eq_);


Ordering.neq = destruct2("tag", "tag") (neq);


Ordering.neq_ = destruct2_("tag", "tag") (neq_);


// Ord


Ordering.compare = oy => ox => {
  const x = Ordering.fromEnum(ox),
   y  = Ordering.fromEnum(oy);

  return x < y
   ? Ordering.LT
   : x > y
    ? Ordering.GT
    : Ordering.EQ;
};


Ordering.compare_ = (ox, oy) => {
  const x = Ordering.fromEnum(ox),
   y  = Ordering.fromEnum(oy);

  return x < y
   ? Ordering.LT
   : x > y
    ? Ordering.GT
    : Ordering.EQ;
};


Ordering.lt = xt(lt_);


Ordering.lt_ = xt_(lt_);


Ordering.lte = xt(lte_);


Ordering.lte_ = xt_(lte_);


Ordering.gt = xt(gt_);


Ordering.gt_ = xt_(gt_);


Ordering.gte = xt(gte_);


Ordering.gte_ = xt_(gte_);


// Enum


Ordering.pred = A(({tag}) => ({
  LT: raise_(TypeError, "invalid pred invocation with LT"),
  EQ: Ordering.LT,
  GT: Ordering.EQ
})[tag]);


Ordering.succ = A(({tag}) => ({
  LT: Ordering.EQ,
  EQ: Ordering.GT,
  GT: raise_(TypeError, "invalid succ invocation with GT")
})[tag]);


Ordering.fromEnum = A(({tag}) => ({LT: 0, EQ: 1, GT: 2})[tag]);


Ordering.toEnum = A(n => {
  switch (n) {
    case 0: return Ordering.LT;
    case 1: return Ordering.EQ;
    case 2: return Ordering.GT;
    default: raise_(RangeError, "argument for toEnum out of range");
  }
});


// Semigroup


Ordering.concat = sy => ({tag}) => ({LT: Ordering.LT, EQ: sy, GT: Ordering.GT})[tag]);


Ordering.concat_ = ({tag}, sy) => ({LT: Ordering.LT, EQ: sy, GT: Ordering.GT})[tag]);


// Monoid


Ordering.append = sy => ({tag}) => ({LT: Ordering.LT, EQ: sy, GT: Ordering.GT})[tag]);


Ordering.append_ = ({tag}, sy) => ({LT: Ordering.LT, EQ: sy, GT: Ordering.GT})[tag]);


Ordering.empty = () => Ordering.EQ;


// API


module.exports = {Ordering, LT, EQ, GT};