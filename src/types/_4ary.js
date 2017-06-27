"use strict";


// dependencies


const Err = require("../product/Err");


/**
 * @name quaternary
 * @type action
 * @status stable
 * @todo replace with sum type
 * @example

  @see handleFun

 */


// (a -> a, b -> b, c -> c, d -> d) -> [a, b, c, d] -> [a, b, c, d]|Error String [?]
const _4ary = (c1, c2, c3, c4) => args =>
 args.length === 4
  ? (c1(args[0]), c2(args[1]), c3(args[2], c4(args[4])), args)
  : Err(ArityError) ("", 4, args.length);


// API


module.exports = _4ary;