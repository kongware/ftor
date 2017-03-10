"use strict";

const {raise_} = require("../generic");

const ordering = {};


// "prototype"


ordering.$Ordering = Symbol("kongware/ftor/Ordering");


// constructors


ordering.LT = () => {
  const api = {};

  api.proto = ordering.$Ordering;

  api.tag = "LT";

  // Bounded

  api.minBound = ordering.LT

  api.maxBound = ordering.GT

  // Enum

  api.pred = raise_(TypeError, "invalid pred application on LT");

  api.succ = () => ordering.EQ;

  return k => k(api);
};


ordering.EQ = () => {
  const api = {};

  api.proto = ordering.$Ordering;

  api.tag = "EQ";

  // Bounded

  api.minBound = ordering.LT

  api.maxBound = ordering.GT

  // Enum

  api.pred = () => ordering.LT;

  api.succ = () => ordering.GT;

  return k => k(api);
};


ordering.GT = () => {
  const api = {};

  api.proto = ordering.$Ordering;

  api.tag = "GT";

  // Bounded

  api.minBound = ordering.LT
  
  api.maxBound = ordering.GT
  
  // Enum

  api.pred = () => ordering.EQ;

  api.succ = raise_(TypeError, "invalid pred application on GT");

  return k => k(api);
};


// API


ordering.get = prop => api => api[prop];


ordering.pred = api => api.pred;


ordering.succ = api => api.succ;


module.exports = ordering;