"use strict";


/**
 * @name binary
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// ?
const binary = (c1, c2) => (args, tag) =>
 args.length === 2
  ? (c1(tag) (args[0]), c2(tag) (args[1]), args)
  : throwType(`${tag} expects two arguments (${args.length} given)`);


// API


module.exports = binary;