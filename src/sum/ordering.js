"use strict";


// dependencies


const {A, I, raise_} = require("../generic");


const {eq, lt_, lte_, gt_, gte_, neq} = require("../primitive/generic");


const {destruct2} = require("../product/object");


// private


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


// API


const Ordering = {};


ordering.Ordering = {
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


  // Eq


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
}

/* deprecated


// Monoid


empty = () => ordering.EQ


ordering.LT = () => {
  const api = Object.create(Ordering);

  api.proto = ordering.Ordering;

  api.tag = "LT";

  // Bounded

  api.minBound = ordering.LT

  api.maxBound = ordering.GT

  // Enum

  api.fromEnum = () => 0;

  api.pred = raise_(TypeError, "invalid pred invocation with LT");

  api.succ = () => ordering.EQ;

  // Eq

  api.eq = fx => fx(ordering.tag) === "LT";

  api.neq = fx => fx(ordering.tag) !== "LT";

  // Ord

  api.compare = fx => fx(ordering.fromEnum) () === 0
   ? ordering.EQ
   : ordering.GT;

  api.gt = fx => fx(ordering.fromEnum) () > 0;

  api.gte = fx => fx(ordering.fromEnum) () >= 0;

  api.lt = _ => false;

  api.lte = fx => fx(ordering.fromEnum) () === 0;

  // Semigroup

  api.concat = _ => ordering.LT

  // Monoid

  api.append = api.concat;

  return k => k(api);
};


ordering.EQ = () => {
  const api = Object.create(Ordering);

  api.proto = ordering.Ordering;

  api.tag = "EQ";

  // Bounded

  api.minBound = ordering.LT

  api.maxBound = ordering.GT

  // Enum

  api.fromEnum = () => 1;

  api.pred = () => ordering.LT;

  api.succ = () => ordering.GT;

  // Eq

  api.eq = fx => fx(ordering.tag) === "EQ";

  api.neq = fx => fx(ordering.tag) !== "EQ";

  // Ord

  api.compare = fx => {
    const n = fx(ordering.fromEnum) ();
    return n < 1
     ? ordering.LT
     : n > 1
      ? ordering.GT
      : ordering.EQ;
  }

  api.gt = fx => fx(ordering.fromEnum) () === 2;

  api.gte = fx => fx(ordering.fromEnum) () >= 1;

  api.lt = fx => fx(ordering.fromEnum) () === 0;

  api.lte = fx => fx(ordering.fromEnum) () <= 1;

  // Semigroup

  api.concat = I

  // Monoid

  api.append = api.concat;

  return k => k(api);
};


ordering.GT = () => {
  const api = Object.create(Ordering);

  api.proto = ordering.Ordering;

  api.tag = "GT";

  // Bounded

  api.minBound = ordering.LT
  
  api.maxBound = ordering.GT
  
  // Enum

  api.fromEnum = () => 2;

  api.pred = () => ordering.EQ;

  api.succ = raise_(TypeError, "invalid pred application on GT");

  // Eq

  api.eq = fx => fx(ordering.tag) === "GT";

  api.neq = fx => fx(ordering.tag) !== "GT";

  // Ord

  api.compare = fx => fx(ordering.fromEnum) () === 2
   ? ordering.EQ
   : ordering.LT;

  api.gt = _ => false;

  api.gte = fx => fx(ordering.fromEnum) () === 2;

  api.lt = fx => fx(ordering.fromEnum) () < 2;

  api.lte = fx => fx(ordering.fromEnum) () <= 2;

  // Semigroup

  api.concat = _ => ordering.GT

  // Monoid

  api.append = api.concat;

  return k => k(api);
};


// API


ordering.get = prop => api => api[prop];


ordering.tag = api => api.tag;


// Enum


ordering.fromEnum = api => api.fromEnum;


ordering.pred = api => api.pred;


ordering.succ = api => api.succ;


ordering.toEnum = api => api.toEnum;


// Eq


ordering.eq = api => api.eq;


ordering.neq = api => api.neq;


// Ord


ordering.compare = api => api.compare;


ordering.gt = api => api.gt;


ordering.gte = api => api.gte;


ordering.lt = api => api.lt;


ordering.lte = api => api.lte;


// Semigroup


ordering.concat = api => api.concat;


// Monoid


ordering.empty = api => api.empty;*/


module.exports = Ordering;