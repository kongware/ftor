"use strict";


// dependencies


const minBound = require("./minBound");
const maxBound = require("./maxBound");


/**
 * @name Bounded
 * @type type representative
 * @status stable
 */


const Bounded = {};


Bounded.minBound = minBound;
Bounded.maxBound = maxBound;


// API


module.exports = Bounded;