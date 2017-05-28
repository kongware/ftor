"use strict";


// dependencies


const {$thunk} = require("./interop");


/**
 * @name lazy
 * @note lazy evaluation; uses a symbol to tag thunks
 * @type higher order function
 * @status stable
 * @example

  @see ./evaluate

 */


// (a -> b) -> a -> () -> b
const lazy = f => x => {
  const thunk = () => f(x);
  return (thunk[$thunk] = true, thunk);
};


// (a -> b -> c) -> a -> b -> () -> c
const lazy2 = f => x => y => {
  const thunk = () => f(x) (y);
  return (thunk[$thunk] = true, thunk);
};


// (a -> b -> c) -> a -> b -> () -> c
const lazy2_ = f => (x, y) => {
  const thunk = () => f(x, y);
  return (thunk[$thunk] = true, thunk);
};


// (a -> b -> c -> d) -> a -> b -> c -> () -> d
const lazy3 = f => x => y => z => {
  const thunk = () => f(x) (y) (z);
  return (thunk[$thunk] = true, thunk);
};


// (a -> b -> c -> d) -> a -> b -> c -> () -> d
const lazy3_ = f => (x, y, z) => {
  const thunk = () => f(x, y, z);
  return (thunk[$thunk] = true, thunk);
};


// API


module.exports = {lazy, lazy2, lazy2_, lazy3, lazy3_};