"use strict";


/**
 * @name unary
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// ?
const unary = c => (args, tag) =>
 args.length === 1
  ? c(tag) (args[0])
  : throwType(`${tag} expects one argument (${args.length} given)`);


// API


module.exports = unary;