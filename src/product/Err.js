"use strict";


// CONSTRUCTOR


/**
 * @name Error
 * @note combined constructor/namespace
 * @type product type
 * @status stable
 */


// String a => (a -> Error) -> [?] -> Error a
Err = cons => (...args) => {
  const e = new cons(args[0]);
  e[Symbol.for("ftor/error")] = args.slice(1);
  return e;
};


// SUBTYPES


// String a => a -> ArityError a
class ArityError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, ArityError);
  }
}


// String a => a -> ReturnTypeError a
class ReturnTypeError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, ReturnTypeError);
  }
}


// SPECIFIC


// String a => (a -> Error) -> [?] -> IO a
const throw_ = cons => (...args) => {
  const e = new cons(args[0]);
  e[Symbol.for("ftor/error")] = args.slice(1);
  throw e;
};


// String a => (a -> Error) -> [?] -> IO a
Err.throw = throw_


// String a => (a -> TypeError) -> [?] -> IO a
Err.throwType = throw_(TypeError);


// String a => (a -> ReturnTypeError) -> [?] -> IO a
Err.throwReturnType = throw_(ReturnTypeError);


// String a => (a -> ArityError) -> [?] -> IO a
Err.throwArity = throw_(ArityError);


// String a => (a -> RangeError) -> [?] -> IO a
Err.throwRange = throw_(RangeError);


// String a => (a -> ReferenceError) -> [?] -> IO a
Err.throwReference = throw_(ReferenceError);


// Error String -> [?]
Err.get$ = e => e[Symbol.for("ftor/error")];


// API


module.exports = {Err, ArityError, ReturnTypeError};