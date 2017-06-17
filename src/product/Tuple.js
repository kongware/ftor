"use strict";


// dependencies


const {$Tuple} = require("../interop");
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
  Tuple[$Tuple] = true;
  return Object.freeze(Object.assign(Tuple, args)); // Map/Set compatibility
};


// SETOID


// Setoid a => (a) -> (a) -> Boolean
Tuple.eq = tx => ty => tx[$Tuple] && ty[$Tuple] && tx(x1 => ty(x2 => x1 === x2));


// (Setoid a, Setoid b) => (a, b) -> (a, b) -> Boolean
Tuple.eq2 = tx => ty => tx[$Tuple] && ty[$Tuple] && tx((x1, y1) => ty((x2, y2) => x1 === x2 && y1 === y2));


// (Setoid a, Setoid b, Setoid c) => (a, b, c) -> (a, b, c) -> Boolean
Tuple.eq3 = tx => ty =>
 tx[$Tuple] && ty[$Tuple] && tx((x1, y1, z1) => ty((x2, y2, z2) => x1 === x2 && y1 === y2 && z1 === z2));


// (a -> a -> Boolean) -> (a) -> (a) -> Boolean
Tuple.eqBy = eq => tx => ty =>
 tx[$Tuple] && ty[$Tuple] && tx(x1 => ty(x2 => eq(x1) (x2)));


// (a -> a -> Boolean) -> (b -> b -> Boolean) -> (a, b) -> (a, b) -> Boolean
Tuple.eqBy2 = (eq1, eq2) => tx => ty =>
 tx[$Tuple] && ty[$Tuple] && tx((x1, y1) => ty((x2, y2) => eq1(x1) (x2) && eq2(y1) (y2)));


// (a -> a -> Boolean) -> (b -> b -> Boolean) -> (c -> c -> Boolean) -> (a, b, c) -> (a, b, c) -> Boolean
Tuple.eqBy3 = (eq1, eq2, eq3) => tx => ty =>
 tx[$Tuple] && ty[$Tuple] && tx((x1, y1, z1) => ty((x2, y2, z2) => eq1(x1) (x2) && eq2(y1) (y2) && eq3(z1) (z2)));


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