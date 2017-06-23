"use strict";


/**
 * @name nullary
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// ?
const unary = () => (args, tag) =>
 args.length === 0
  ? args
  : throwType(`${tag} expects no arguments (${args.length} given)`);


// API


module.exports = nullary;