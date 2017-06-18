"use strict";


// dependencies


const {$tag, $Either} = require("../interop");
const {compare} = require("../primitive/compare");
const EQ = require("../primitive/EQ");
const I = require("../function/I");
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


// forall r . a -> (a -> r) -> (b -> r) -> r
const Left = x => {
  const Left = f => {
    const Left = g => f(x);
    return Left[$tag] = "Left", Left[$Either] = true, Left;
  };

  return Left[$tag] = "Left", Left[$Either] = true, Left;
};

Either.Left = Left;


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


// ((a -> a -> Boolean), (b -> b -> Boolean)) -> Either a b -> Either a b -> Boolean
Either.eqBy = (eq1, eq2) => tx => ty =>
 tx[$Either] && ty[$Either] && tx(x => ty(y => eq1(x) (y)) (_ => false)) (x => ty(_ => false) (y => eq2(x) (y));


// (Setoid a, Setoid b) => Either a b -> Either a b -> Boolean
Either.neq = tx => ty => tx[$Either] && ty[$Either] && tx(x => ty(y => x !== y) (_ => true)) (x => ty(_ => true) (y => x !== y));


// ((a -> a -> Boolean), (b -> b -> Boolean)) -> Either a b -> Either a b -> Boolean
Either.neqBy = (neq1, neq2) => tx => ty =>
 tx[$Either] && ty[$Either] && tx(x => ty(y => neq1(x) (y)) (_ => true)) (x => ty(_ => true) (y => neq2(x) (y));


// ORD


// (Ord a, Ord b) => Either a b -> Either a b -> Number ordering
Either.compare = tx => ty => tx[$Either] && ty[$Either] && tx(x => ty(y => compare(x) (y)) (_ => LT)) (x => ty(_ => GT) (y => compare(x) (y)));


// (Ord a, Ord b) => Either a b -> Either a b -> Number ordering
Either.compare_ = ty => tx => tx[$Either] && ty[$Either] && tx(x => ty(y => compare(x) (y)) (_ => LT)) (x => ty(_ => GT) (y => compare(x) (y)));


// ((a -> a -> ordering), (b -> b -> ordering)) -> Either a b -> Either a b -> Number ordering
Either.compareBy = (compare1, compare2) => tx => ty =>
  tx[$Either] && ty[$Either] && tx(x => ty(y => compare1(x) (y)) (_ => LT)) (x => ty(_ => GT) (y => compare2(x) (y)));


// (Ord a, Ord b) => Either a b -> Either a b -> Boolean
Either.lt = tx => ty => tx[$Either] && ty[$Either] && tx(x => ty(y => x < y) (_ => true)) (x => ty(_ => false) (y => x < y));


// (a -> a -> Boolean, b -> b -> Boolean) -> Either a b -> Either a b -> Boolean
Either.ltBy = (lt1, lt2) => tx => ty =>
 tx[$Either] && ty[$Either] && tx(x => ty(y => lt1(x) (y)) (_ => true)) (x => ty(_ => false) (y => lt2(x) (y)));


// (Ord a, Ord b) => Either a b -> Either a b -> Boolean
Either.lte = tx => ty => tx[$Either] && ty[$Either] && tx(x => ty(y => x <= y) (_ => true)) (x => ty(_ => false) (y => x <= y));


// (a -> a -> Boolean, b -> b -> Boolean) -> Either a b -> Either a b -> Boolean
Either.lteBy = (lte1, lte2) => tx => ty =>
 tx[$Either] && ty[$Either] && tx(x => ty(y => lte1(x) (y)) (_ => true)) (x => ty(_ => false) (y => lte2(x) (y)));


// (Ord a, Ord b) => Either a b -> Either a b -> Boolean
Either.gt = tx => ty => tx[$Either] && ty[$Either] && tx(x => ty(y => x > y) (_ => false)) (x => ty(_ => true) (y => x > y));


// (a -> a -> Boolean, b -> b -> Boolean) -> Either a b -> Either a b -> Boolean
Either.gtBy = (gt1, gt2) => tx => ty =>
 tx[$Either] && ty[$Either] && tx(x => ty(y => gt1(x) (y)) (_ => false)) (x => ty(_ => true) (y => gt2(x) (y)));


// (Ord a, Ord b) => Either a b -> Either a b -> Boolean
Either.gte = tx => ty => tx[$Either] && ty[$Either] && tx(x => ty(y => x >= y) (_ => false)) (x => ty(_ => true) (y => x >= y));


// (a -> a -> Boolean, b -> b -> Boolean) -> Either a b -> Either a b -> Boolean
Either.gteBy = (gte1, gte2) => tx => ty =>
 tx[$Either] && ty[$Either] && tx(x => ty(y => gte1(x) (y)) (_ => false)) (x => ty(_ => true) (y => gte2(x) (y)));


// (Ord a, Ord b) => Either a b -> Either a b -> Either a b
Either.min = tx => ty => tx[$Either] && ty[$Either] && tx(x => ty(y => x < y ? tx : ty) (_ => tx)) (x => ty(_ => ty) (y => x < y ? tx : ty));


// (a -> a -> Boolean, b -> b -> Boolean) -> Either a b -> Either a b -> Either a b
Either.minBy = (min1, min2) => tx => ty =>
 tx[$Either] && ty[$Either] && tx(x => ty(y => min1(x) (y) ? tx : ty) (_ => tx)) (x => ty(_ => ty) (y => min2(x) (y) ? tx : ty));


// (Ord a, Ord b) => Either a b -> Either a b -> Either a b
Either.max = tx => ty => tx[$Either] && ty[$Either] && tx(x => ty(y => x > y ? tx : ty) (_ => ty)) (x => ty(_ => tx) (y => x > y ? tx : ty));


// (a -> a -> Boolean, b -> b -> Boolean) -> Either a b -> Either a b -> Either a b
Either.maxBy = (max1, max2) => tx => ty =>
 tx[$Either] && ty[$Either] && tx(x => ty(y => max1(x) (y) ? tx : ty) (_ => ty)) (x => ty(_ => tx) (y => max2(x) (y) ? tx : ty));


// SEMIGROUP


// Semigroup b => Either a b -> Either a b -> Either a b
Either.append = tx => ty => tx[$Either] && ty[$Either] && tx(x => ty(_ => tx) (_ => ty)) (x => ty(_ => tx) (y => Right(x + y)));


// (b -> b -> b) -> Either a b -> Either a b -> Either a b
Either.appendBy = append => tx => ty =>
 tx[$Either] && ty[$Either] && tx(x => ty(_ => tx) (_ => ty)) (x => ty(_ => tx) (y => Right(append(x) (y)));


// Semigroup b => Either a b -> Either a b -> Either a b
Either.prepend = ty => tx => tx[$Either] && ty[$Either] && tx(x => ty(_ => tx) (_ => ty)) (x => ty(_ => tx) (y => Right(x + y)));


// (b -> b -> b) -> Either a b -> Either a b -> Either a b
Either.prependBy = append => ty => tx =>
 tx[$Either] && ty[$Either] && tx(x => ty(_ => tx) (_ => ty)) (x => ty(_ => tx) (y => Right(append(x) (y)));


// MONOID


// b -> Either a b
Either.empty = empty => Right(empty);


// (b -> b -> b, b) -> [Either a b] -> Either a b
Either.concat = (append, empty) => xs => Right(xs.reduce((acc, tx) => tx[$Either] && tx(_ => acc) (x => append(acc) (x)), empty));


// FOLDABLE


// b -> Either a b -> b
Either.fold = empty => tx => tx[$Either] && tx(_ => empty) (I);


// (c -> b -> c) -> c -> Either a b -> c
Either.foldl = f => acc => tx => tx[$Either] && tx(_ => acc) (x => f(acc) (x));


// (b -> c -> c) -> c -> Either a b -> c
Either.foldr = f => acc => tx => tx[$Either] && tx(_ => acc) (x => f(x) (acc));


// c -> (b -> c) -> Either a b -> c
Either.foldMap = empty => f => tx => tx[$Either] && tx(_ => empty) (x => f(x));


// Either a b -> Number
Either.len = tx => tx(_ => 0) (_ => 1);


// Either a b -> [b]
Either.toList = tx => tx(_ => []) (x => [x]);


// Either a b -> Boolean
Either.null = tx => tx(_ => true) (_ => false);


// b -> Either a b -> Boolean
Either.has = x => tx => tx(_ => false) (y => x === y);


// BIFOLDABLE


// Either a a -> a
Either.bifold = tx => tx[$Either] && tx(I) (I);


// (c -> a -> c) -> (c -> b -> c) -> c -> Either a b -> c
Either.bifoldl = f => g => acc => tx => tx[$Either] && tx(x => f(acc) (x)) (x => g(acc) (x));


// (a -> c -> c) -> (b -> c -> c) -> c -> Either a b -> c
Either.bifoldr = f => g => acc => tx => tx[$Either] && tx(x => f(x) (acc)) (x => g(x) (acc));


// (a -> c) -> (b -> c) -> Either a b -> c
Either.bifoldMap = f => g => tx => tx[$Either] && tx(x => f(x)) (x => g(x));


// TRAVERSABLE


// Applicative f => (b -> f c) -> Either a b -> f (Either a c)
Either.traverse = (of, map) => ft => tx => tx[$Either] && tx(_ => of(tx)) (x => map(Right) (ft(x)));


// Applicative f => Either a (f b) -> f (Either a b)
Either.sequence = (of, map) => traverse(of, map) (I);


// BITRAVERSABLE


// FUNCTOR


// (b -> c) -> Either a b -> Either a c
Either.map = f => tx => tx[$Either] && tx(_ => tx) (x => Right(f(x)));


// BIFUNCTOR


// (a -> c) -> (b -> d) -> Either a b -> Either b d
Either.bimap = f => g => tx => tx[$Either] && tx(x => Left(f(x))) (x => Right(g(x)));


// APPLY


// Either a (b -> c) -> Either a b -> Either a c
Either.ap = tf => tx => tf[$Either] && tx[$Either] && tf(_ => tx) (f => tx(_ => tx) (x => Right(f(x))));


// Either a b -> Either a (b -> c) -> Either a c
Either.ap_ = tx => tf => tf[$Either] && tx[$Either] && tf(_ => tx) (f => tx(_ => tx) (x => Right(f(x))));


// APPLICATIVE


// b -> Either a b
Either.of = x => Right(x);


// MONAD


// Either a (Either a b) -> Either a b
Either.join = ttx => ttx[$Either] && ttx(_ => ttx) (tx => tx[$Either] && tx);


// (b -> Either a c) -> Either a b -> Either a c
Either.chain = ft => tx => tx[$Either] && tx(_ => tx) (x => {
  const r = ft(x);
  return r[$Either] && r;
});


// Either a b -> (b -> Either a c) -> Either a c
Either.chain_ = tx => ft => tx[$Either] && tx(_ => tx) (x => {
  const r = ft(x);
  return r[$Either] && r;
});


// ALT


// Either a b -> Either a b -> Either a b
Either.alt = tx => ty => tx(_ => ty(_ => ty) (_ => ty)) (_ => ty(_ => tx) (_ => tx));


// PLUS


// a -> Either a b
Either.zero = x => Left(x);


// SPECIFIC


// Either a b -> Boolean
Either.isLeft = tx => tx[$Either] && tx(_ => true) (_ => false);


// Either a b -> Boolean
Either.isRight = tx => tx[$Either] && tx(_ => false) (_ => true);


// [Either a b] -> [a]
Either.lefts = xs => xs.reduce((acc, tx) => tx[$Either] && tx(x => acc.concat([x])) (_ => acc), []);


// TODO: lefts generalized with Foldable constraint


// [Either a b] -> [b]
Either.rights = xs => xs.reduce((acc, tx) => tx[$Either] && tx(_ => acc) (x => acc.concat([x])), []);


// TODO: rights generalized with Foldable constraint


// TODO: partition :: [Either a b] -> ([a], [b])


// API


module.exports = {Either, Left, Right};