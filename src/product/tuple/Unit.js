"use strict";


/**
 * @name unit tuple
 * @type constant constructor
 * @example
 *

   Unit() (x => x); // undefined

 */


// () -> (() -> a) -> a
const Unit = () => f => f();


// API


module.exports = Unit;