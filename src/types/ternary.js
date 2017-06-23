"use strict";


/**
 * @name ternary
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// ?
const ternary = (c1, c2, c3) => (args, tag) =>
 args.length === 3
  ? (c1(tag) (args[0]), c2(tag) (args[1]), c3(tag) (args[2]))
  : throwType(`${tag} expects two arguments (${args.length} given)`);


// API


module.exports = ternary;