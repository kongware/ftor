"use strict";


// dependencies


const Err = require("../product/Err");


/**
 * @name binary
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// (a -> a, b -> b) -> [a, b] -> [a, b]|Error String [?]
const binary = (c1, c2) => args =>
 args.length === 2
  ? (c1(args[0]), c2(args[1]), args)
  : Err(ArityError) ("", 2, args.length);


// API


module.exports = binary;