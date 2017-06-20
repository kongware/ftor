"use strict";


// dependencies


const {$tag, $Option} = require("../interop");
const {compare} = require("../primitive/compare");
const EQ = require("../primitive/EQ");
const I = require("../function/I");
const LT = require("../primitive/LT");
const GT = require("../primitive/GT");


/**
 * @name Option
 * @note Church encoded
 * @type sum type
 * @status stable
 */


const Option = {};


// CONSTRUCTORS


// forall r . a -> r -> (a -> r) -> r
const Some = x => {
  const Some = r => {
    const Some = f => f(x);
    return Some[$tag] = "Some", Some[$Option] = true, Some;
  };

  return Some[$tag] = "Some", Some[$Option] = true, Some;
};

Option.Some = Some;


// forall r . r -> (a -> r) -> r
const None = r => {
  const None = f => r;
  return None[$tag] = "None", None[$Option] = true, None;
};

None[$tag] = "None";
None[$Option] = true;
Option.None = None;


// SETOID


// Setoid a => Option a -> Option a -> Boolean
Option.eq = tx => ty => tx[$Option] && ty[$Option] && tx(ty(true) (_ => false)) (x => ty(false) (y => x === y));


// (a -> a -> Boolean) -> Option a -> Option a -> Boolean
Option.eqBy = eq => tx => ty =>
 tx[$Option] && ty[$Option] && tx(ty(true) (_ => false)) (x => ty(false) (y => eq(x) (y)));


// Setoid a => Option a -> Option a -> Boolean
Option.neq = tx => ty => tx[$Option] && ty[$Option] && tx(ty(false) (_ => true)) (x => ty(true) (y => x !== y));


// (a -> a -> Boolean) -> Option a -> Option a -> Boolean
Option.neqBy = neq => tx => ty =>
 tx[$Option] && ty[$Option] && tx(ty(false) (_ => true)) (x => ty(true) (y => neq(x) (y)));


// ORD


// Ord a => Option a -> Option a -> Number ordering
Option.compare = tx => ty => tx[$Option] && ty[$Option] && tx(ty(EQ) (_ => LT)) (x => ty(GT) (y => compare(x) (y)));


// Ord a => Option a -> Option a -> Number ordering
Option.compare_ = ty => tx => tx[$Option] && ty[$Option] && tx(ty(EQ) (_ => LT)) (x => ty(GT) (y => compare(x) (y)));


// (a -> a -> Boolean) -> Option a -> Option a -> Number ordering
Option.compareBy = compare => tx => ty =>
 tx[$Option] && ty[$Option] && tx(ty(EQ) (_ => LT)) (x => ty(GT) (y => compare(x) (y)));


// Ord a => Option a -> Option a -> Boolean
Option.lt = tx => ty => tx[$Option] && ty[$Option] && tx(ty(false) (_ => true)) (x => ty(false) (y => x < y));


// (a -> a -> Boolean) -> Option a -> Option a -> Boolean
Option.ltBy = lt => tx => ty =>
 tx[$Option] && ty[$Option] && tx(ty(false) (_ => true)) (x => ty(false) (y => lt(x) (y)));


// Ord a => Option a -> Option a -> Boolean
Option.lte = tx => ty => tx[$Option] && ty[$Option] && tx(ty(true) (_ => true)) (x => ty(false) (y => x <= y));


// (a -> a -> Boolean) -> Option a -> Option a -> Boolean
Option.lteBy = lte => tx => ty =>
 tx[$Option] && ty[$Option] && tx(ty(true) (_ => true)) (x => ty(false) (y => lte(x) (y)));


// Ord a => Option a -> Option a -> Boolean
Option.gt = tx => ty => tx[$Option] && ty[$Option] && tx(ty(false) (_ => false)) (x => ty(true) (y => x > y));


// (a -> a -> Boolean) -> Option a -> Option a -> Boolean
Option.gtBy = gt => tx => ty =>
 tx[$Option] && ty[$Option] && tx(ty(false) (_ => false)) (x => ty(true) (y => gt(x) (y)));


// Ord a => Option a -> Option a -> Boolean
Option.gte = tx => ty => tx[$Option] && ty[$Option] && tx(ty(true) (_ => false)) (x => ty(true) (y => x >= y));


// (a -> a -> Boolean) -> Option a -> Option a -> Boolean
Option.gteBy = gte => tx => ty =>
 tx[$Option] && ty[$Option] && tx(ty(true) (_ => false)) (x => ty(true) (y => gte(x) (y)));


// Ord a => Option a -> Option a -> Option a
Option.min = tx => ty => tx[$Option] && ty[$Option] && tx(ty(tx) (_ => tx)) (x => ty(ty) (y => x < y ? tx : ty));


// (a -> a -> Boolean) -> Option a -> Option a -> Option a
Option.minBy = min => tx => ty =>
 tx[$Option] && ty[$Option] && tx(ty(tx) (_ => tx)) (x => ty(ty) (y => min(x) (y) ? tx : ty));


// Ord a => Option a -> Option a -> Option a
Option.max = tx => ty => tx[$Option] && ty[$Option] && tx(ty(tx) (_ => ty)) (x => ty(tx) (y => x > y ? tx : ty));


// (a -> a -> Boolean) -> Option a -> Option a -> Option a
Option.maxBy = max => tx => ty =>
 tx[$Option] && ty[$Option] && tx(ty(tx) (_ => ty)) (x => ty(tx) (y => max(x) (y) ? tx : ty));


// SEMIGROUP


// Semigroup a => Option a -> Option a -> Option a
Option.append = tx => ty => tx[$Option] && ty[$Option] && tx(ty(None) (_ => ty)) (x => ty(y => x + y));


// (a -> a -> a) -> Option a -> Option a -> Option a
Option.appendBy = append => tx => ty =>
 tx[$Option] && ty[$Option] && tx(ty(None) (_ => ty)) (x => ty(y => append(x) (y)));


// Semigroup a => Option a -> Option a -> Option a
Option.prepend = ty => tx => tx[$Option] && ty[$Option] && tx(ty(None) (_ => ty)) (x => ty(y => x + y));


// (a -> a -> a) -> Option a -> Option a -> Option a
Option.prependBy = prepend => ty => tx =>
 tx[$Option] && ty[$Option] && tx(ty(None) (_ => ty)) (x => ty(y => prepend(x) (y)));


// MONOID


// Option a
Option.empty = None;


// (a -> a -> a, a) -> [Option a] -> Option a
Option.concat = (append, empty) => xs =>
 Some(xs.reduce((acc, tx) => tx[$Option] && tx(acc) (x => append(acc) (x)), empty));


// FOLDABLE


// a -> Option a -> a
Option.fold = empty => tx => tx[$Option] && tx(empty) (I);


// b -> (a -> b) -> Option a -> b
Option.foldMap = empty => f => tx => tx[$Option] && tx(empty) (x => f(x));


// (b -> a -> b) -> b -> Option a -> b
Option.foldl = f => acc => tx => tx[$Option] && tx(acc) (x => f(acc) (x));


// (a -> b -> b) -> b -> Option a -> b
Option.foldr = f => acc => tx => tx[$Option] && tx(acc) (x => f(x) (acc);


// TODO: foldl1, foldr1


// Option a -> Number
Option.len = tx => tx(0) (_ => 1);


// Option a -> [a]
Option.toList = tx => tx([]) (x => [x]);


// Option a -> Boolean
Option.null = tx => tx(true) (_ => false);


// a -> Option a -> Boolean
Option.has = x => tx => tx(false) (y => x === y);


// TRAVERSABLE


// Applicative f => ((a -> b) -> f a -> f b, a -> f a) -> (a -> f b) -> Option a -> f (Option b)
Option.traverse = (map, of) => ft => tx => tx[$Option] && tx(of(None)) (x => map(Some) (ft(x)));


// Applicative f => ((a -> b) -> f a -> f b, a -> f a) -> Option (f a) -> f (Option a)
Option.sequence = (map, of) => tx => tx[$Option] && tx(of(None)) (ux => map(Some) (ux));


// FUNCTOR


// (a -> b) -> Option a -> Option b
Option.map = f => tx => tx[$Option] && tx(None) (x => Some(f(x)));


// TODO: mapConst


// APPLY


// Option (a -> b) -> Option a -> Option b
Option.ap = tf => tx => tf[$Option] && tx[$Option] && tf(None) (f => tx(None) (x => Some(f(x))));


// Option a -> Option (a -> b) -> Option b
Option.ap_ = tx => tf => tf[$Option] && tx[$Option] && tf(None) (f => tx(None) (x => Some(f(x))));


// APPLICATIVE


// a -> Option a
Option.of = Some;


// MONAD


// Option (Option a) -> Option a
Option.join = ttx => ttx[$Option] && ttx(None) (tx => tx[$Option] && tx);


// (a -> Option b) -> Option a -> Option b
Option.chain = ft => tx => tx[$Option] && tx(None) (x => {
  const r = ft(x);
  return r[$Option] && r;
});


// Option a -> (a -> Option b) -> Option b
Option.chain = tx => ft => tx[$Option] && tx(None) (x => {
  const r = ft(x);
  return r[$Option] && r;
});


// ALT


// Option a -> Option a -> Option a
Option.alt = tx => ty => tx(ty) (_ => tx);


// TODO: some, any


// PLUS


// Option a
Option.zero = None;


// SPECIFIC


// Option a -> Boolean
Option.isSome = tx => tx[$tag] === "Some";


// Option a -> Boolean
Option.isNone = tx => tx[$tag] === "None";


// (a -> Boolean) -> Option a -> Option a
Option.filter = pred => tx => tx(None) (x => pred(x) ? Some(x) : None);


// a -> Option a -> a
Option.fromOption = x => tx => tx(x) (y => y);


// [Option a] -> [a]
Option.concatSome = xs => xs.reduce((acc, tx) => tx(acc) (x => acc.concat([x])), []);


// TODO: concatSome generalized with Foldable constraint (foldSome?)


// (Foldable t, Monoid t) => t (Option a) -> t a
Option.mapSome = f => xs => xs.reduce((acc, tx) => tx(acc) (x => acc.concat([f(x)])), []);


// API


module.exports = {Option, Some, None};