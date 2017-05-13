"use strict";


// dependencies


const I = require("../I");
const {K} = require("../K");
const {$tag} = require("../interop");


/**
 * @name either
 * @note Church encoded sum type
 * @type data type
 * @kind * -> * -> *
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


// Foldable


/**
 * @name fold Left
 * @type higher order function
 * @status stable
 * @example

   const $tag = Symbol.for("ftor/tag");
   const I = x => x;

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
   const I = x => x;

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


// a -> Either e a
Either.of = x => Right(x);


// Either e (Either e a) -> Either e a
Either.join = ttx => {
  switch (ttx[$tag]) {
    case "left": return ttx;
    case "right": return ttx(I) (I);
    default: throw new TypeError("Either expected");
  }
};


// (a -> Either e b) -> Either e a -> Either e b
Either.chain = ft => tx => Either.join(Either.map(x => ft(x)) (tx));


// API


module.exports = Either;