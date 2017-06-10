"use strict";


// dependencies


const {$tag, $Either} = require("../interop");
const {compare} = require("../primitive/compare");
const {compareBy} = require("../compareBy");
const EQ = require("../primitive/EQ");
const LT = require("../primitive/LT");
const GT = require("../primitive/GT");


/**
 * @name Either
 * @note Church encoded
 * @type sum type
 * @status stable
 */


const Either = {};


// CONSTRUCTORS


/**
 * @name Left
 * @type constructor
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Either = Symbol.for("ftor/Either");
  const Either = {};

  const Left = x => {
    const Left = f => {
      const Left = g => f(x);
      return Left[$tag] = "Left", Left[$Either] = true, Left;
    };

    return Left[$tag] = "Left", Left[$Either] = true, Left;
  };

  const I = x => x
  const uc = x => x.toUpperCase();

  Left("foo") (I) (uc); // "foo"

 */

// forall r . a -> (a -> r) -> (b -> r) -> r
const Left = x => {
  const Left = f => {
    const Left = g => f(x);
    return Left[$tag] = "Left", Left[$Either] = true, Left;
  };

  return Left[$tag] = "Left", Left[$Either] = true, Left;
};

Either.Left = Left;


/**
 * @name Right
 * @type constructor
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const Either = {};

  const Right = x => {
    const Right = f => {
      const Right = g => g(x);
      return (Right[$tag] = "right", Right);
    };

    return (Right[$tag] = "right", Right);
  };

  const I = x => x;
  const uc = x => x.toUpperCase();

  Right("foo") (I) (uc); // "FOO"

 */


// forall r . b -> (a -> r) -> (b -> r) -> r
const Right = x => {
  const Right = f => {
    const Right = g => g(x);
    return Right[$tag] = "Right", Right[$Either] = true, Right;
  };

  return Right[$tag] = "Right", Right[$Either] = true, Right;
};

Either.Right = Right;


// SETOID


// (Setoid a, Setoid b) => Either a b -> Either a b -> Boolean
Either.eq = tx => ty => tx[$Either] && ty[$Either] && tx(x => ty(y => x === y) (_ => false)) (x => ty(_ => false) (y => x === y));


// (Setoid a, Setoid b) => Either a b -> Either a b -> Boolean
Either.neq = tx => ty => tx[$Either] && ty[$Either] && tx(x => ty(y => x !== y) (_ => true)) (x => ty(_ => true) (y => x !== y));


// (Setoid a, Setoid b) => ((a -> a -> Boolean), (b -> b -> Boolean)) -> Either a b -> Either a b -> Boolean
Either.eqBy = (eq1, eq2) => tx => ty => tx[$Either] && ty[$Either] && tx(x => ty(y => eq1(x) (y)) (_ => false)) (x => ty(_ => false) (y => eq2(x) (y));


// (Setoid a, Setoid b) => ((a -> a -> Boolean), (b -> b -> Boolean)) -> Either a b -> Either a b -> Boolean
Either.neqBy = (neq1, neq2) => tx => ty => tx[$Either] && ty[$Either] && tx(x => ty(y => neq1(x) (y)) (_ => true)) (x => ty(_ => true) (y => neq2(x) (y));


// ORD


// (Ord a, Ord b, Number ordering) => Either a b -> Either a b -> ordering
Either.compare = tx => ty => tx[$Either] && ty[$Either] && tx(x => ty(y => compare(x) (y)) (_ => LT)) (x => ty(_ => GT) (y => compare(x) (y)));


// (Ord a, Ord b, Number ordering) => Either a b -> Either a b -> ordering
Either.compare_ = ty => tx => tx[$Either] && ty[$Either] && tx(x => ty(y => compare(x) (y)) (_ => LT)) (x => ty(_ => GT) (y => compare(x) (y)));


// (Ord a, Ord b, Number ordering) => ((a -> a -> ordering), (b -> b -> ordering)) -> Either a b -> Either a b -> ordering
Either.compareBy = (compare1, compare2) => tx => ty =>
  tx[$Either] && ty[$Either] && tx(x => ty(y => compare1(x) (y)) (_ => LT)) (x => ty(_ => GT) (y => compare2(x) (y)));


// (Ord a, Ord b, Number ordering) => ((a -> a -> ordering), (b -> b -> ordering)) -> Either a b -> Either a b -> ordering
Either.compareBy_ = (compare1, compare2) => ty => tx =>
  tx[$Either] && ty[$Either] && tx(x => ty(y => compare1(x) (y)) (_ => LT)) (x => ty(_ => GT) (y => compare2(x) (y)));


// (Ord a, Ord b) => Either a b -> Either a b -> Boolean
Either.lt = tx => ty => tx[$Either] && ty[$Either] && tx(x => ty(y => x < y) (_ => true)) (x => ty(_ => false) (y => x < y));


// (Ord a, Ord b) => Either a b -> Either a b -> Boolean
Either.lte = tx => ty => tx[$Either] && ty[$Either] && tx(x => ty(y => x <= y) (_ => true)) (x => ty(_ => false) (y => x <= y));


// (Ord a, Ord b) => Either a b -> Either a b -> Boolean
Either.gt = tx => ty => tx[$Either] && ty[$Either] && tx(x => ty(y => x > y) (_ => false)) (x => ty(_ => true) (y => x > y));


// (Ord a, Ord b) => Either a b -> Either a b -> Boolean
Either.gte = tx => ty => tx[$Either] && ty[$Either] && tx(x => ty(y => x >= y) (_ => false)) (x => ty(_ => true) (y => x >= y));


Either.min = tx => ty => tx[$Either] && ty[$Either] && tx(x => ty(y => x < y ? tx : ty) (_ => tx)) (x => ty(_ => ty) (y => x < y ? tx : ty));


Either.minBy = (min1, min2) => tx => ty =>
 tx[$Either] && ty[$Either] && tx(x => ty(y => min1(x) (y) ? tx : ty) (_ => tx)) (x => ty(_ => ty) (y => min2(x) (y) ? tx : ty));


Either.max = tx => ty => tx[$Either] && ty[$Either] && tx(x => ty(y => x > y ? tx : ty) (_ => ty)) (x => ty(_ => tx) (y => x > y ? tx : ty));


Either.maxBy = (max1, max2) => tx => ty =>
 tx[$Either] && ty[$Either] && tx(x => ty(y => max1(x) (y) ? tx : ty) (_ => ty)) (x => ty(_ => tx) (y => max2(x) (y) ? tx : ty));


// SEMIGROUP


// MONOID


// FOLDABLE


Either.fold = f => acc => tx => tx[$Either] && tx(_ => acc) (x => f(acc) (x));


// BIFOLDABLE


Either.bifold = f => g => acc => tx => tx[$Either] && tx(x => f(acc) (x)) (x => g(acc) (x));


// TRAVERSABLE


// FUNCTOR


Either.map = f => tx => tx[$Either] && tx(_ => tx) (x => Right(f(x)));


// BIFUNCTOR


Either.bimap = f => g => tx => tx[$Either] && tx(x => Left(f(x))) (x => Right(g(x)));


// APPLY


Either.ap = tf => tx => tf[$Either] && tx[$Either] && tf(_ => tx) (f => tx(_ => tx) (x => Right(f(x))));


// APPLICATIVE


Either.of = x => Right(x);


// MONAD


Either.chain = ft => tx => tx[$Either] && tx(_ => tx) (x => {
  const r = ft(x);
  return r[$Either] && r;
});


Either.chain_ = tx => ft => tx[$Either] && tx(_ => tx) (x => {
  const r = ft(x);
  return r[$Either] && r;
});


// ALT


// PLUS


// SPECIFIC


// API


module.exports = {Either, Left, Right};