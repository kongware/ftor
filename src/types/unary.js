"use strict";


// dependencies


const Err = require("../product/Err");


/**
 * @name unary
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// (a -> a) -> [a] -> [a]|Error String [?]
const unary = c => args =>
 args.length === 1
  ? (c(args[0]), args)
  : Err(ArityError) ("", 1, args.length);


// API


module.exports = unary;