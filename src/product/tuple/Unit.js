"use strict";


/**
 * @name unit tuple
 * @type nullary data constructor
 * @example
 *

   @see Pair

 */


// () -> (() -> a) -> a
const Unit = () => f => f();


// API


module.exports = Unit;