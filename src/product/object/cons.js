"use strict";


/**
 * @name constructor
 * @type variadic constructor
 * @example
 *

   cons(Map) ([0, false], [1, true]); // Map {0 => false, 1 => true}
   cons(Set) (true, false); // Set {true, false}
   cons(Number) (123); // Number {[[PrimitiveValue]]: 123}
   cons(Date) ([2017, 1, 1]); // Sun Jan 01 2017

 */


// ?
const cons = ctor => (...args) => Reflect.construct(ctor, [args]);


// API


module.exports = cons;