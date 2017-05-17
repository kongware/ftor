"use strict";


// dependencies


//const {B_} = require("../B");


/**
 * @name Tuple
 * @note combined namespace/constructor
 * @type product type
 * @status stable
 * @example

  const Tuple = (...args) => f => f(...args);
  Tuple.toArray = (...args) => args;
  const triple = Tuple(1, "a", true);

  triple(Tuple.toArray); // [1, "a", true]

 */


const Tuple = (...args) => f => f(...args);


// API


module.exports = Tuple;