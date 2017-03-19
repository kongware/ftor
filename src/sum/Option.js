"use strict";


// dependencies


const {alwaysFalse, alwaysTrue, K, negf3, negf3_} = require("../generic");


const {EQ, GT, LT} = require("./ordering");


// private


const binarySum = (k, g, h, i) => ({[k]: f}) => fy => fx => Option.fold(
  x => Option.fold(y => f(x, y)) (g) (fy)
) (() => Option.fold(h) (i) (fy)) (fx);


const binarySum_ = (k, g, h, i) => (fx, fy, {[k]: f}) => Option.fold(
  x => Option.fold(y => f(x, y)) (g) (fy)
) (() => Option.fold(h) (i) (fy)) (fx);


// type representative


const Option = {};


// constructors


const Some = x => ({type: Option, tag: "some", x: x});


const None = () => ({type: Option, tag: "none"});


const none = None();


// general


Option.cata = pattern => ({tag, x}) => pattern[tag](x);


// Setoid


Option.eq = binarySum("eq_", alwaysFalse, alwaysFalse, alwaysTrue);


Option.eq_ = binarySum_("eq_", alwaysFalse, alwaysFalse, alwaysTrue);


Option.neq = negf3(Option.eq);


Option.neq_ = negf3_(Option.eq);


// Ord


Option.compare = binarySum("compare_", GT, LT, EQ);


Option.compare_ = binarySum_("compare_", GT, LT, EQ);


Option.lt = binarySum("lt_", alwaysFalse, alwaysTrue, alwaysFalse);


// Enum


// Foldable


Option.fold = f => g => Option.cata({some: f, none: g});


// Semigroup


// Monoid


// Contravaraint


// Functor


// Alt


// Apply


// Bifunctor


// Extend


// Profunctor


// Traversable


// Plus


// Applicative


// Chain


// Comonad


// Alternative


// Monad


// ChainRec


// API


module.exports = {Option, Some, None, none};