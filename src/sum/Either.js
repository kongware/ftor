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

  const render = template => (...args) => template.replace(/\$\{(\d+)}/g, (_, i) => args[i]);

  const throw_ = cons => template => x => {
    throw new cons(render(template) (x));
  };

  const I = x => x

  Left("foo") (throw_(RangeError) ("invalid value ${0}")) (I); // RangeError: "invalid value foo"

 */

// a -> (a -> c) -> (b -> c) -> c
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


// b -> (a -> c) -> (b -> c) -> c
const Right = x => {
  const Right = f => {
    const Right = g => g(x);
    return Right[$tag] = "Right", Right[$Either] = true, Right;
  };

  return Right[$tag] = "Right", Right[$Either] = true, Right;
};

Either.Right = Right;


// API


module.exports = {Either, Left, Right};