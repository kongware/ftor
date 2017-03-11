"use strict";

const {I, raise_} = require("../generic");

const ordering = {};


// prototype


ordering.Ordering = {
  // Enum

  toEnum: n => n === 0
   ? ordering.LT
   : n === 1
    ? ordering.EQ
    : n === 2
     ? ordering.GT
     : raise_(RangeError, "argument for toEnum out of range"),

  // Monoid

  empty = () => ordering.EQ
};


// constructors


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


ordering.empty = api => api.empty;


module.exports = ordering;