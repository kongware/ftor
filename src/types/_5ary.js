"use strict";


/**
 * @name quinary
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// ?
const _5ary = (c1, c2, c3, c4, c5) => (args, tag) =>
 args.length === 5
  ? (c1(tag) (args[0]), c2(tag) (args[1]), c3(tag) (args[2]), c4(tag) (args[3]), c5(tag) (args[4]), args)
  : throwType(`${tag} expects five arguments (${args.length} given)`);


// API


module.exports = _5ary;