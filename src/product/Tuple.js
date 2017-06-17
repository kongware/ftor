"use strict";


// dependencies


const compare = require("../primitive/compare");
const compareBy = require("./compareBy");
const eq = require("../primitive/eq");
const EQ = require("../primitive/EQ");
const LT = require("../primitive/LT");
const GT = require("../primitive/GT");


// CONSTRUCTOR


/**
 * @name Tuple
 * @note combined type/value constructor
 * @type product type
 * @status stable
 */


// forall r . (*) -> ((*) -> r) -> r
const Tuple = (...args) => {
  const Tuple = f => f(...args);
  return Object.freeze(Object.assign(Tuple, args)); // Map/Set compatibility
};


// SETOID


// ORD


// SEMIGROUP


// MONOID


// FOLDABLE


// BIFOLDABLE


// TRAVERSABLE


// BITRAVERSABLE


// FUNCTOR


// BIFUNCTOR


// ALT


// PLUS


// SPECIFIC


// API


module.exports = Tuple;