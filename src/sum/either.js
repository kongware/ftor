"use strict";


// dependencies


const {$tag} = require("../interop");
const {compare, compare_} = require("../primitive/compare");
const False = require("../False");
const I = require("../I");
const {K} = require("../K");
const {throw_} = require("../debug/throw_");


/**
 * @name Either
 * @note Church encoded
 * @type sum type
 * @status stable
 */


 const Either = {};


// constructors


/**
 * @name Left
 * @type constructor
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const Either = {};

  const Left = x => {
    const Left = f => {
      const Left = g => f(x);
      return (Left[$tag] = "left", Left);
    };

    return (Left[$tag] = "left", Left);
  };

  const I = x => x;
  const uc = x => x.toUpperCase();

  Left("foo") (I) (uc); // "foo"

 */

// a -> (a -> c) -> (b -> c) -> c
const Left = x => {
  const Left = f => {
    const Left = g => f(x);
    return (Left[$tag] = "left", Left);
  };

  return (Left[$tag] = "left", Left);
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


// a -> (a -> c) -> (b -> c) -> c
const Right = x => {
  const Right = f => {
    const Right = g => g(x);
    return (Right[$tag] = "right", Right);
  };

  return (Right[$tag] = "right", Right);
};


Either.Right = Right;


// catamorphism


/**
 * @name either
 * @note catamorphism; semantic sugar
 * @type higher order function
 * @status stable
 */


// (a -> c) -> (b -> c) -> Either a b -> c
Either.either = f => g => tx => tx(f) (g);


// Setoid


/**
 * @name binary equal
 * @note commutative
 * @type first order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const Either = {};

  const Left = x => {
    const Left = f => {
      const Left = g => f(x);
      return (Left[$tag] = "left", Left);
    };

    return (Left[$tag] = "left", Left);
  };

  const Right = x => {
    const Right = f => {
      const Right = g => g(x);
      return (Right[$tag] = "right", Right);
    };

    return (Right[$tag] = "right", Right);
  };

  Either.eq = tx => ty => tx(x => ty(y => x === y) (False)) (x => ty(False) (y => x === y));

  const K = x => y => x;
  const False = K(false);

  Either.eq(Right("foo")) (Right("foo")); // true
  Either.eq(Right("foo")) (Right("bar")); // false
  Either.eq(Left("foo")) (Right("foo")); // false

 */


// (Setoid a, Setoid b) => Either a b -> Either a b -> Boolean
Either.eq = tx => ty => tx(x => ty(y => x === y) (False)) (x => ty(False) (y => x === y));


/**
 * @name equal by
 * @note commutative
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const Either = {};

  const Left = x => {
    const Left = f => {
      const Left = g => f(x);
      return (Left[$tag] = "left", Left);
    };

    return (Left[$tag] = "left", Left);
  };

  const Right = x => {
    const Right = f => {
      const Right = g => g(x);
      return (Right[$tag] = "right", Right);
    };

    return (Right[$tag] = "right", Right);
  };

  Either.eqBy = p => q => tx => ty => tx(x => ty(y => p(x) (y)) (False)) (x => ty(False) (y => q(x) (y)));

  const K = x => y => x;
  const False = K(false);
  const get = k => o => o[k];

  const leftEq = xs => ys => xs.length === ys.length && xs[0] === xs[0];
  const rightEq = k => o => p => o[k] === p[k];

  Either.eqBy(leftEq) (rightEq("foo")) (Right({foo: "bar"})) (Right({foo: "bar"})); // true
  Either.eqBy(leftEq) (rightEq("foo")) (Right({foo: "bar"})) (Right({foo: "baz"})); // false
  Either.eqBy(leftEq) (rightEq("foo")) (Left(["foo"])) (Left(["foo"])); // true
  Either.eqBy(leftEq) (rightEq("foo")) (Left(["bar"])) (Right({foo: "bar"})); // false

 */


Either.eqBy = p => q => tx => ty => tx(x => ty(y => p(x) (y)) (False)) (x => ty(False) (y => q(x) (y)));


// Ord


/**
 * @name compare
 * @type first order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const Either = {};

  const Left = x => {
    const Left = f => {
      const Left = g => f(x);
      return (Left[$tag] = "left", Left);
    };

    return (Left[$tag] = "left", Left);
  };

  const Right = x => {
    const Right = f => {
      const Right = g => g(x);
      return (Right[$tag] = "right", Right);
    };

    return (Right[$tag] = "right", Right);
  };

  Either.compare = tx => ty => tx(x => ty(y => compare(x) (y)) (throw_(TypeError) ("Left expected") (I)))
  (x => ty(throw_(TypeError) ("Right expected") (I)) (y => compare(x) (y)));

  const compare = x => y => x < y ? -1 : y < x ? 1 : 0;
  const render = template => (...args) => template.replace(/\$\{(\d+)}/g, (_, i) => args[i]);
  const sort = f => xs => xs.sort((x, y) => f(x) (y));
  const append = xs => x => xs.append([x]);
  const I = x => x;

  const throw_ = cons => template => f => x => {
   throw new cons(render(template) (f(x)));
  };

  const xs = [Right(5), Right(3), Right(1), Right(4), Right(2)],
  ys = [Right(5), Right(3), Left(1), Right(4), Right(2)],

  sort(Either.compare) (xs); // [Right(1), Right(2), Right(3), Right(4), Right(5)]
  sort(Either.compare) (ys); // TypeError: "Right expected"

 */


Either.compare = tx => ty => tx(x => ty(y => compare(x) (y)) (throw_(TypeError) ("Left expected") (I)))
 (x => ty(throw_(TypeError) ("Right expected") (I)) (y => compare(x) (y)));


// Foldable


/**
 * @name fold Left
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const Either = {};

  const Left = x => {
    const Left = f => {
      const Left = g => f(x);
      return (Left[$tag] = "left", Left);
    };

    return (Left[$tag] = "left", Left);
  };

  const Right = x => {
    const Right = f => {
      const Right = g => g(x);
      return (Right[$tag] = "right", Right);
    };

    return (Right[$tag] = "right", Right);
  };

  Either.foldl = f => acc => tx => f(acc) (tx(I) (I));

  const I = x => x;
  const sub = x => y => x - y;

  Either.foldl(sub) (10) (Left(2)); // 8
  Either.foldl(sub) (10) (Right(2)); // 8

 */


// (b -> a -> b) -> b -> Either a a -> b
Either.foldl = f => acc => tx => f(acc) (tx(I) (I));


/**
 * @name fold Right
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const Either = {};

  const Left = x => {
    const Left = f => {
      const Left = g => f(x);
      return (Left[$tag] = "left", Left);
    };

    return (Left[$tag] = "left", Left);
  };

  const Right = x => {
    const Right = f => {
      const Right = g => g(x);
      return (Right[$tag] = "right", Right);
    };

    return (Right[$tag] = "right", Right);
  };

  Either.foldr = f => acc => tx => f(tx(I) (I)) (acc);

  const I = x => x;
  const sub = x => y => x - y;

  Either.foldr(sub) (10) (Left(2)); // -8
  Either.foldr(sub) (10) (Right(2)); // -8

 */


// (a -> b -> b) -> b -> Either a a -> b
Either.foldr = f => acc => tx => f(tx(I) (I)) (acc);


// Functor


/**
 * @name map
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const Either = {};

  const Left = x => {
    const Left = f => {
      const Left = g => f(x);
      return (Left[$tag] = "left", Left);
    };

    return (Left[$tag] = "left", Left);
  };

  const Right = x => {
    const Right = f => {
      const Right = g => g(x);
      return (Right[$tag] = "right", Right);
    };

   return (Right[$tag] = "right", Right);
  };

  Either.map = f => tx => {
    switch (tx[$tag]) {
      case "left": return tx;
      case "right": return Right(tx(I) (f));
      default: throw new TypeError("Either expected");
    }
  };

  const I = x => x;
  const sqr = x => x * x;

  Either.map(sqr) (Left("error")); // Left "error"
  Either.map(sqr) (Right(5)); // Right 25

 */


// (a -> b) -> Either a a -> Either a b
Either.map = f => tx => {
  switch (tx[$tag]) {
    case "left": return tx;
    case "right": return Right(tx(I) (f));
    default: throw new TypeError("Either expected");
  }
};


// Applicative


/**
 * @name of
 * @type first order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const Either = {};

  Right = x => {
    const Right = f => {
      const Right = g => g(x);
      return (Right[$tag] = "right", Right);
    };

    return (Right[$tag] = "right", Right);
  };

  Either.of = x => Right(x);

  Either.of("foo"); // Right "foo"

 */


// a -> Either e a
Either.of = x => Right(x);


/**
 * @name apply
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const Either = {};

  Left = x => {
    const Left = f => {
      const Left = g => f(x);
      return (Left[$tag] = "left", Left);
    };

    return (Left[$tag] = "left", Left);
  };

  Right = x => {
    const Right = f => {
      const Right = g => g(x);
      return (Right[$tag] = "right", Right);
    };

    return (Right[$tag] = "right", Right);
  };

  Either.map = f => tx => {
    switch (tx[$tag]) {
      case "left": return tx;
      case "right": return Right(tx(I) (f));
      default: throw new TypeError("Either expected");
    }
  };

  Either.ap = tf => tx => tf(K(tf)) (f => Either.map(f) (tx));

  const I = x => x;
  const K = x => y => x;
  const add = x => y => x + y;

  Either.ap(Either.map(add) (Left("error"))) (Right(5)); // Left "error"
  Either.ap(Either.map(add) (Right(5))) (Left("error")); // Left "error"
  Either.ap(Either.map(add) (Left("error1"))) (Left("error2")); // Left "error1"
  Either.ap(Either.map(add) (Right(5))) (Right(5)); // Right 10

 */


// Either e (a -> b) -> Either e a -> Either e b
Either.ap = tf => tx => tf(K(tf)) (f => Either.map(f) (tx));


// Monad


/**
 * @name join
 * @type first order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const Either = {};

  const Left = x => {
    const Left = f => {
      const Left = g => f(x);
      return (Left[$tag] = "left", Left);
    };

    return (Left[$tag] = "left", Left);
  };

  const Right = x => {
    const Right = f => {
      const Right = g => g(x);
      return (Right[$tag] = "right", Right);
    };

    return (Right[$tag] = "right", Right);
  };

  Either.join = ttx => {
    switch (ttx[$tag]) {
      case "left": return ttx;
      case "right": return ttx(I) (I);
      default: throw new TypeError("Either expected");
    }
  };

  const I = x => x;

  Either.join(Right(Right("foo"))); // Right "foo"
  Either.join(Right(Left("error"))); // Left "error"
  Either.join(Left("error")); // Left "error"

 */


// Either e (Either e a) -> Either e a
Either.join = ttx => {
  switch (ttx[$tag]) {
    case "left": return ttx;
    case "right": return ttx(I) (I);
    default: throw new TypeError("Either expected");
  }
};


/**
 * @name chain
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const Either = {};

  const Left = x => {
    const Left = f => {
      const Left = g => f(x);
      return (Left[$tag] = "left", Left);
    };

    return (Left[$tag] = "left", Left);
  };

  const Right = x => {
    const Right = f => {
      const Right = g => g(x);
      return (Right[$tag] = "right", Right);
    };

    return (Right[$tag] = "right", Right);
  };

  Either.map = f => tx => {
    switch (tx[$tag]) {
      case "left": return tx;
      case "right": return Right(tx(I) (f));
      default: throw new TypeError("Either expected");
    }
  };

  Either.of = x => Right(x);

  Either.join = ttx => {
    switch (ttx[$tag]) {
      case "left": return ttx;
      case "right": return ttx(I) (I);
      default: throw new TypeError("Either expected");
    }
  };

  Either.chain = ft => tx => Either.join(Either.map(x => ft(x)) (tx));

  const I = x => x;
  const sqr = x => x * x;
  const dbl = x => x * 2;

  Either.chain(x => x >= 10 ? Either.of(dbl(x)) : Either.of(sqr(x))) (Right(5)); // Right 25
  Either.chain(x => x >= 10 ? Either.of(dbl(x)) : Either.of(sqr(x))) (Right(10)); // Right 20
  Either.chain(x => x >= 10 ? Either.of(dbl(x)) : Either.of(sqr(x))) (Left("error")); // Left "error"

 */


// (a -> Either e b) -> Either e a -> Either e b
Either.chain = ft => tx => Either.join(Either.map(x => ft(x)) (tx));


// API


module.exports = {Either, Left, Right};