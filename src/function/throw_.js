"use strict";


/**
 * @name throw
 * @type action
 * @status stable
 * @example

  const throw_ = cons => x => {
    throw new cons(x);
  };

  throw_(TypeError) (`invalid type ${null}`); // TypeError: invalid type null

 */


// (String -> IO String) -> String -> IO String
const throw_ = cons => x => {
  throw new cons(x);
};


// API


module.exports = throw_;