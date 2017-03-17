"use strict";


// dependencies


const {A, I, raise_} = require("../generic");


const {eq, lt_, lte_, gt_, gte_, neq} = require("../primitive/generic");


const {destruct2} = require("../product/object");


// internal API


const xt = f => gx => fx => {
  const x = Ordering.fromEnum(fx),
   y  = Ordering.fromEnum(gx);

  return f(x, y);
};


const xt_ = f => (gx, fx) => {
  const x = Ordering.fromEnum(fx),
   y  = Ordering.fromEnum(gx);

  return f(x, y);
};


// external API


const Ordering = {};


// constructors


LT = () => ({type: Ordering, tag: "LT"})


EQ = () => ({type: Ordering, tag: "EQ"})


GT = () => ({type: Ordering, tag: "GT"})


// general


Ordering.cata = pattern => ({tag}) => pattern[tag]();


// Bounded


Ordering.minBound = Ordering.LT;


Ordering.maxBound = Ordering.GT;


// Enum


Ordering.pred = A(({tag}) => ({
  LT: raise_(TypeError, "invalid pred invocation with LT"),
  EQ: ordering.LT,
  GT: ordering.EQ
})[tag]);


Ordering.succ = A(({tag}) => ({
  LT: ordering.EQ,
  EQ: ordering.GT,
  GT: raise_(TypeError, "invalid succ invocation with GT")
})[tag]);


Ordering.fromEnum = A(({tag}) => ({LT: 0, EQ: 1, GT: 2})[tag]);


Ordering.toEnum = A(n => {
  switch (n) {
    case 0: return ordering.LT;
    case 1: return ordering.EQ;
    case 2: return ordering.GT;
    default: raise_(RangeError, "argument for toEnum out of range");
  }
});


// Setoid


Ordering.eq = destruct2("tag", "tag") (eq);


Ordering.neq = destruct2("tag", "tag") (neq);


// Ord


Ordering.compare = gx => fx => {
  const x = Ordering.fromEnum(fx),
   y  = Ordering.fromEnum(gx);

  return x < y
   ? Ordering.LT
   : x > y
    ? Ordering.GT
    : Ordering.EQ;
};


Ordering.compare_ = (fx, gx) => {
  const x = Ordering.fromEnum(fx),
   y  = Ordering.fromEnum(gx);

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


// Semigroup


Ordering.concat = A(({tag}) => ({LT: Ordering.LT, EQ: I, GT: Ordering.GT})[tag]);


// Monoid


Ordering.append = AA(({tag}) => ({LT: Ordering.LT, EQ: I, GT: Ordering.GT})[tag]);


Ordering.empty = () => Ordering.EQ;


module.exports = {Ordering: Ordering, LT: LT, EQ: EQ, GT: GT};