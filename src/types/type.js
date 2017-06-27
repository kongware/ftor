"use strict";


/**
 * @name type
 * @note proxy based runtime type enhancer
 * @note impure
 * @type action
 * @status stable
 * @example

  @see handleFun

 */


// {String: Function} -> (String, String, Function) -> [? -> ?] -> Function
const type = handler => (type, name, f) => (...cs) => {
  // create new proxy instance
  const g = new Proxy(f, handler(name, cs));

  // enable string coercion for apply traps
  g.toString = Function.prototype.toString.bind(f);

  return g;
};


// API


module.exports = type;