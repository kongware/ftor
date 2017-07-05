"use strict";


/**
 * @name Error
 * @note combined namespace/constructor
 * @type product type
 * @rev 1
 */


// a -> Id a
Err = cons => (...args) => {
  const e = new cons();
  e[Symbol.for("ftor/error")] = args;
  return e;
};


// SUBCLASS CONSTRUCTORS


class ArityError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, ArityError);
  }
};


class ReturnTypeError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, ReturnTypeError);
  }
};


// SPECIFIC


Err.throw = (e, msg) => {e.message = msg; throw e};


Err.throwType = Err.throw(TypeError);


Err.throwReturnType = Err.throw(ReturnTypeError);


Err.throwArity = Err.throw(ArityError);


Err.throwRange = Err.throw(RangeError);


Err.throwReference = Err.throw(ReferenceError);


Err.throwIfNot = (x, f) => {
  if (getType(x) === "Error") {x.message = f(x); throw x};
  return x;
};


Err.get$ = e => e[Symbol.for("ftor/error")];


// API


module.exports = Err;