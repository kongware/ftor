"use strict";


/**
 * @name iterator
 * @type first order function
 * @status stable
 * @example

  const itor = iter => iter[Symbol.iterator]();
  itor([1, 2, 3]); // Array Iterator

 */


// Iterable -> Iterator
const itor = iter => iter[Symbol.iterator]();

// API


module.exports = itor;