"use strict";


// dependencies


const eq = require("../eq");
const neq = require("../neq");


/**
 * @name Setoid
 * @note equality
 * @type type representative
 * @status unstable
 */


const Setoid = {};


/**
 * @name equal
 * @type first order function
 * @status unstable
 * @example

   ?

 */


// Boolean -> Boolean -> Boolean
Setoid.eq = eq;


/**
 * @name not equal
 * @type first order function
 * @status unstable
 * @example

   ?

 */


// Boolean -> Boolean -> Boolean
Setoid.neq = neq;


// API


module.exports = Setoid;