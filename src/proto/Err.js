"use strict";


/**
 * @name Error
 * @note combined namespace/constructor
 * @type prototype/polymorphic function
 * @rev 0
 */


// (String -> Error) -> (...?) -> Error (String [?])
const Err = cons => (...args) => {
  const e = new cons();
  e[Symbol.for("ftor/error")] = args;
  return e;
};


// SUBCLASS CONSTRUCTORS


/**
 * @name Arity Error
 * @type first order function
 * @rev 0
 */


// String -> ArityError
class ArityError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, ArityError);
  }
};


/**
 * @name Return Type Error
 * @type first order function
 * @rev 0
 */


// String -> ReturnTypeError
class ReturnTypeError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, ReturnTypeError);
  }
};


// THROWING


/**
 * @name throw
 * @type first order function
 * @rev 0
 */


// String -> Error -> IO
Err.throw_ = msg => e => {e.message = msg; throw e};


/**
 * @name throw on error
 * @type first order function
 * @rev 0
 */


// a -> (a -> String) -> a|IO
Err.throwIfNot = x => f => {
  if (Error.prototype.isPrototypeOf(x)) {x.message = f(x); throw x};
  return x;
};


// GETTER


/**
 * @name get symbol
 * @type first order function
 * @rev 0
 */


// Error (String [?]) -> [?]
Err.get$ = e => e[Symbol.for("ftor/error")];


// API


module.exports = Err;