"use strict";


// dependencies


const throwType = require("../function/throwType");


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
  ? (c(tag) (args[0]), args)
  : throwType(`${tag} expects one argument (${args.length} given)`);


// API


module.exports = unary;