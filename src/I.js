"use strict";


/**
 * @name identity
 * @type function
 * @param {*} x - type variable
 * @return {*} the unchanged argument
 * @example
 *
 * const o = {};
 * I(o) === o; // true
 */


// a -> a
const I = x => x;


module.exports = I;