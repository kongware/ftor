"use strict";


/**
 * @name Set
 * @note combined namespace/constructor
 * @type abstract type
 * @status stable
 * @example

  const Set_ = (...args) => {
    return new Set(args);
  };

  Set_(1, "a", {}); // Set {1, "a", {}}

 */


const Set_ = (...args) => {
  return new Set(args);
};


// API


module.exports = Set_;