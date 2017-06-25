"use strict";


// CONSTRUCTOR


/**
 * @name Error
 * @note combined constructor/namespace
 * @type product type
 * @status stable
 */


// (String -> Error) -> (...*) -> Error
Err = cons => (...args) => {
  const e = new cons(args[0]);
  e[Symbol.for("ftor/error")] = args.slice(1);
  return e;
};


// SUBTYPES


class ArityError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, ArityError);
  }
}


class ReturnTypeError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, ReturnTypeError);
  }
}


// SPECIFIC


throw_ = e => {throw e};


Err.throw = throw_


Err.throwType = comp_(throw_, Err(TypeError));


Err.throwReturnType = throw_(ReturnTypeError);


Err.throwArity = throw_(ArityError);


Err.throwRange = throw_(RangeError);


Err.throwReference = throw_(ReferenceError);


Err.get$ = e => e[Symbol.for("ftor/error")];


// API


module.exports = {Err, ArityError, ReturnTypeError};