"use strict";


/**
 * @name quaternary
 * @type action
 * @status stable
 * @example

  @see interceptF

 */


// ?
const _4ary = (c1, c2, c3, c4) => (args, tag) =>
 args.length === 4
  ? (c1(tag) (args[0]), c2(tag) (args[1]), c3(tag) (args[2]), c4(tag) (args[3]))
  : throwType(`${tag} expects two arguments (${args.length} given)`);


// API


module.exports = _4ary;