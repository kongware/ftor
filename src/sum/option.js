"use strict";


// dependencies


const {A, I, raise_} = require("../generic");


// internal API


// external API


const Option = {};


// constructors


Some = x => ({type: Option, tag: "some", x: x});


None = () => ({type: Option, tag: "none"});


// misc


Option.cata = pattern => ({tag, x}) => pattern[tag](x);


// Setoid


Option.eq = rep => fx => fy => fold(
  x => fold(y => rep.eq_(x, y)) (K(false))
) (fold(K(false)) (K(true)));


// Ord


// Enum


// Foldable


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


Option.fold = f => g => Option.cata({some: f, none: g});


module.exports = {Option: Option, Some: Some, None: None};