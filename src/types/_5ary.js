"use strict";


// dependencies


const Err = require("../product/Err");


/**
 * @name quinary
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// (a -> a, b -> b, c -> c, d -> d, e -> e) -> [a, b, c, d, e] -> [a, b, c, d, e]|Error String [?]
const _5ary = (c1, c2, c3, c4, c5) => args =>
 args.length === 5
  ? (c1(args[0]), c2(args[1]), c3(args[2], c4(args[4]), c5(args[5])), args)
  : Err(ArityError) ("", 5, args.length);


// API


module.exports = _5ary;