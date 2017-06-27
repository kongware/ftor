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


// () -> [] -> []|Error String [?]
const unary = c => args =>
 args.length === 0
  ? args
  : Err(ArityError) ("", 0, args.length);


// API


module.exports = nullary;