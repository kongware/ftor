"use strict";


// dependencies


const {$tag, $Either} = require("../interop");


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


// ORD


// SEMIGROUP


// MONOID


// FOLDABLE


Either.fold = f => acc => tx => tx[$Either] && tx(_ => acc) (x => f(acc) (x));


// BIFOLDABLE


// TRAVERSABLE


// FUNCTOR


Either.map = f => tx => tx[$Either] && tx(_ => tx) (x => Right(f(x)));


// BIFUNCTOR


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