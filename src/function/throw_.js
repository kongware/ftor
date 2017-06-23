"use strict";


/**
 * @name throw
 * @type action
 * @status stable
 * @example

  const throw_ = cons => f => (...args) => {
    throw new cons(f(...args));
  };

  throw_(TypeError) (x => `invalid type ${null}`) (null); // TypeError: invalid type null

 */


// (a -> IO a) -> (...* -> a) -> (...args) -> IO
const throw_ = cons => f => (...args) => {
  throw new cons(f(...args));
};


// API


module.exports = throw_;