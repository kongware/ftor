"use strict";


/**
 * @name type
 * @note proy based runtime type checker
 * @note impure
 * @type action
 * @status stable
 * @example

  @see handleFun
  @see handleCons

 */


// {String: Function} -> (String, Function) -> [? -> ?] -> Function
const type = handler => (name, f) => (...cs) => {
  // create new proxy instance
  const g = new Proxy(f, handler(name, cs));

  // enable string coercion for apply traps
  g.toString = Function.prototype.toString.bind(f);

  return g;
};


// API


module.exports = type;