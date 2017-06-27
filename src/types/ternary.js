"use strict";


// dependencies


const Err = require("../product/Err");


/**
 * @name ternary
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// (a -> a, b -> b, c -> c) -> [a, b, c] -> [a, b, c]|Error String [?]
const ternary = (c1, c2, c3) => args =>
 args.length === 3
  ? (c1(args[0]), c2(args[1]), c3(args[2]), args)
  : Err(ArityError) ("", 3, args.length);


// API


module.exports = ternary;